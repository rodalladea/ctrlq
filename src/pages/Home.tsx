import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Folder,
    FileText,
    SettingsIcon,
    Menu,
    SquarePen,
    Dot,
} from "lucide-react";
import { AppConfig } from "../shared/config";
import Dropdown from "../components/Dropdown";

interface File {
    name: string;
    changed: boolean;
    active: boolean;
    content?: string;
}

const Home: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const loadConfig = async () => {
            const config = await window.electronAPI.getConfig();
            setConfig(config);

            if (config?.defaultFolder) {
                const filePaths = await window.electronAPI.listFiles(
                    config?.defaultFolder || ""
                );
                if (filePaths.length) {
                    const content = await window.electronAPI.readFile(
                        filePaths[0]
                    );
                    setFiles(
                        filePaths.map((filePath, index) => ({
                            name: filePath,
                            changed: false,
                            active: index === 0,
                            content: index === 0 ? content : undefined,
                        }))
                    );
                }
            }
        };
        loadConfig();
    }, []);

    useEffect(() => {
        if (textareaRef.current && !isMenuOpen) {
            textareaRef.current.focus();
        }
    }, [isMenuOpen]);

    const handleCreateFile = async () => {
        if (config?.defaultFolder) {
            const filePath = await window.electronAPI.newFile(
                config.defaultFolder
            );
            setFiles((oldFiles) => [
                ...oldFiles.map((f) => ({ ...f, active: false })),
                { name: filePath, changed: false, active: true },
            ]);
        }
    };

    const handleDeleteFile = async (
        e: React.MouseEvent<HTMLButtonElement>,
        file: string
    ) => {
        e.stopPropagation();
        try {
            await window.electronAPI.deleteFile(file);
            setFiles((oldFiles) => oldFiles.filter((f) => f.name !== file));
            if (files.find((f) => f.active)?.name === file) {
                setFiles((oldFiles) =>
                    oldFiles.map((f) => ({ ...f, active: false }))
                );
            }
        } catch (error) {
            console.error("Failed to delete file:", error);
        }
    };

    const handleRenameFile = async (file: string, newName: string) => {
        try {
            const dirPath = file.substring(0, file.lastIndexOf("/") + 1);
            const newPath = dirPath + newName;

            const currentFile = files.find((f) => f.name === file);

            // Save content if it's changed
            if (currentFile?.changed) {
                await window.electronAPI.writeFile(
                    file,
                    currentFile.content || ""
                );
            }

            await window.electronAPI.renameFile(file, newPath);

            // Update files list
            setFiles((oldFiles) =>
                oldFiles.map((f) =>
                    f.name === file
                        ? { ...f, name: newPath, changed: false }
                        : f
                )
            );
        } catch (error) {
            console.error("Failed to rename file:", error);
        }
    };

    const handleFileClick = async (file: File) => {
        const content = await window.electronAPI.readFile(file.name);
        setFiles((oldFiles) =>
            oldFiles.map((f) => {
                if (f.name === file.name) {
                    return {
                        ...f,
                        content: file.content || content,
                        active: true,
                    };
                }

                if (
                    f.active &&
                    f.content &&
                    !f.changed &&
                    f.name !== file.name
                ) {
                    return {
                        ...f,
                        content: undefined,
                        active: false,
                    };
                }

                return { ...f, active: false };
            })
        );
        setIsMenuOpen(false);
    };

    const handleSaveFile = async (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === "s" && e.metaKey) {
            e.preventDefault(); // Prevent default browser save action
            const activeFile = files.find((f) => f.active);
            if (activeFile) {
                await window.electronAPI.writeFile(
                    activeFile.name,
                    activeFile.content || ""
                );
                setFiles((oldFiles) =>
                    oldFiles.map((f) =>
                        f.name === activeFile.name
                            ? { ...f, changed: false }
                            : f
                    )
                );
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFiles((oldFiles) =>
            oldFiles.map((f) => {
                if (f.name === files.find((f) => f.active)?.name) {
                    return {
                        ...f,
                        content: e.target.value,
                        changed: true,
                    };
                }

                return f;
            })
        );
    };

    return (
        <div className="w-full h-screen flex overflow-hidden">
            <div
                className={`w-64 bg-zinc-800 transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } fixed top-0 left-0 h-full z-10 flex flex-col`}
            >
                <div className="flex justify-between items-center mx-2 mt-2 p-2 pb-0 border-b border-zinc-700">
                    <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-zinc-300" />
                        <span className="text-zinc-300 font-semibold">
                            {config?.defaultFolder?.split("/").pop() ||
                                "Folder"}
                        </span>
                    </div>
                    <button
                        onClick={handleCreateFile}
                        className="cursor-pointer p-2 text-zinc-300 hover:text-white flex items-center"
                    >
                        <SquarePen strokeWidth={2} className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-2 py-2">
                    {files.map((file) => (
                        <div
                            key={file.name}
                            onClick={() => handleFileClick(file)}
                            className={`group flex w-full justify-between items-center gap-2 cursor-pointer text-sm text-zinc-300 hover:bg-zinc-600 rounded-md px-2 py-1 ${
                                file.active || openDropdown === file.name
                                    ? "bg-zinc-700"
                                    : "bg-transparent"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="flex-shrink-0 w-4 h-4 text-zinc-300" />
                                <span
                                    className={`truncate ${
                                        file.changed ? "text-yellow-200" : ""
                                    }`}
                                >
                                    {file.name.split("/").pop()}
                                </span>
                            </div>
                            <div
                                className={
                                    openDropdown === file.name
                                        ? "block"
                                        : "group-hover:block hidden"
                                }
                            >
                                <Dropdown
                                    isOpen={openDropdown === file.name}
                                    onOpenChange={(isOpen) =>
                                        setOpenDropdown(
                                            isOpen ? file.name : null
                                        )
                                    }
                                    onDelete={(e) =>
                                        handleDeleteFile(e, file.name)
                                    }
                                    onRename={(newName) =>
                                        handleRenameFile(file.name, newName)
                                    }
                                    fileName={file.name.split("/").pop() || ""}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <Link
                    to="/settings"
                    className="mt-auto flex items-center m-2 gap-1 cursor-pointer text-sm text-zinc-300 hover:text-white p-2 border-t border-zinc-700"
                >
                    <SettingsIcon className="w-4 h-4 text-zinc-300" />
                    <span>Settings</span>
                </Link>
            </div>

            <div
                className={`flex-1 h-screen transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-64" : "translate-x-0"
                }`}
            >
                <div className="p-3 flex items-center gap-2">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="cursor-pointer text-zinc-300 hover:text-white flex items-center"
                    >
                        <Menu strokeWidth={2} className="w-6 h-6" />
                    </button>
                    <div className="text-zinc-300 flex items-center gap-1">
                        {files
                            .find((f) => f.active)
                            ?.name.split("/")
                            .pop()}
                        {files.find((f) => f.active)?.changed && (
                            <Dot strokeWidth={10} className="w-4 h-4" />
                        )}
                    </div>
                </div>
                <div className="flex-1 h-full">
                    <textarea
                        className="bg-transparent w-full h-full p-3 pt-0 text-white outline-none resize-none rounded-md shadow-md"
                        autoFocus
                        spellCheck={false}
                        value={files.find((f) => f.active)?.content || ""}
                        onChange={handleFileChange}
                        onKeyDown={handleSaveFile}
                        ref={textareaRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
