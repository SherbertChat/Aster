#include <iostream>
#include <filesystem>
#include <string>
#include <stdexcept>
#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#include <sys/wait.h>
#endif

namespace fs = std::filesystem;

std::string getSherbertFolderPath() {
#ifdef _WIN32
    return "C://programfiles/sherbertlabs/sherbert";
#else
    return "/.local/sherbertlabs/sherbert";
#endif
}

std::string executeCommand(const std::string& cmd) {
    std::string output;
    char buffer[128];
#ifdef _WIN32
    FILE* pipe = _popen(cmd.c_str(), "r");
#else
    FILE* pipe = popen(cmd.c_str(), "r");
#endif
    if (!pipe) throw std::runtime_error("popen() failed!");
    try {
        while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
            output += buffer;
        }
    } catch (...) {
#ifdef _WIN32
        _pclose(pipe);
#else
        pclose(pipe);
#endif
        throw;
    }
#ifdef _WIN32
    _pclose(pipe);
#else
    pclose(pipe);
#endif
    return output;
}

bool checkForChanges() {
    std::string repoPath = fs::temp_directory_path() / "aster";
    if (!fs::exists(repoPath)) {
        executeCommand("git clone https://github.com/sherbertchat/aster.git " + repoPath.string());
    } else {
        executeCommand("git -C " + repoPath.string() + " pull");
    }
    std::string diffOutput = executeCommand("diff -r " + getSherbertFolderPath() + " " + repoPath.string());
    return !diffOutput.empty();
}

void replaceFiles() {
    std::string repoPath = fs::temp_directory_path() / "aster";
    for (const auto& entry : fs::recursive_directory_iterator(getSherbertFolderPath())) {
        if (entry.is_regular_file()) {
            std::string filename = entry.path().filename().string();
            if (filename != "updateagent.cpp") {
                fs::path targetPath = repoPath / fs::relative(entry.path(), getSherbertFolderPath());
                try {
                    fs::copy_file(targetPath, entry.path(), fs::copy_options::overwrite_existing);
                } catch (const std::filesystem::filesystem_error& e) {
                    std::cerr << "Error copying file: " << e.what() << std::endl;
                }
            }
        }
    }
}

void launchClient() {
#ifdef _WIN32
    std::string clientPath = "C://programfiles/sherbertlabs/client.exe";
    ShellExecute(nullptr, "open", clientPath.c_str(), nullptr, nullptr, SW_SHOWNORMAL);
#elif __APPLE__
    std::string clientPath = "/Applications/client.app";
    execl(clientPath.c_str(), clientPath.c_str(), nullptr);
#else
    std::string clientPath = "/usr/local/bin/client.appimage";
    if (fork() == 0) {
        execl(clientPath.c_str(), clientPath.c_str(), nullptr);
        _exit(EXIT_FAILURE);
    } else {
        wait(nullptr);
    }
#endif
}

int main() {
    if (checkForChanges()) {
        std::cout << "Changes detected! Updating files..." << std::endl;
        replaceFiles();
        std::cout << "Update complete." << std::endl;
    } else {
        std::cout << "No changes detected." << std::endl;
    }

    launchClient();
    return 0;
}
