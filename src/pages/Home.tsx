import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Folder, FileText, SettingsIcon, Menu, SquarePen } from "lucide-react";
import { AppConfig } from "../shared/config";

const Home: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [files, setFiles] = useState<string[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);

    useEffect(() => {
        const loadConfig = async () => {
            const config = await window.electronAPI.getConfig();
            setConfig(config);

            if (config?.defaultFolder) {
                const files = await window.electronAPI.listFiles(
                    config?.defaultFolder || ""
                );
                setFiles(files);
            }
        };
        loadConfig();
    }, []);

    const handleCreateFile = async () => {
        if (config?.defaultFolder) {
            const filePath = await window.electronAPI.newFile(
                config.defaultFolder
            );
            setFiles((oldFiles) => [...oldFiles, filePath]);
        }
    };

    const handleFileClick = (file: string) => {
        setActiveFile(file);
    };

    return (
        <div className="w-full h-screen flex overflow-hidden">
            <div
                className={`w-64 bg-zinc-800 transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } fixed top-0 left-0 h-full z-10 flex flex-col justify-between`}
            >
                <div>
                    <div className="flex justify-between items-center mx-2 mt-2">
                        <div className="flex p-2 items-center gap-2">
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
                    <div className="px-2">
                        {files.map((file) => (
                            <button
                                key={file}
                                onClick={() => handleFileClick(file)}
                                className={`flex w-full items-center gap-2 cursor-pointer text-sm text-zinc-300 hover:bg-zinc-600 rounded-md px-2 py-1 ${
                                    activeFile === file
                                        ? "bg-zinc-700"
                                        : "bg-transparent"
                                }`}
                            >
                                <FileText className="flex-shrink-0 w-4 h-4 text-zinc-300" />
                                <span className="truncate">
                                    {file.split("/").pop()}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <Link
                    to="/settings"
                    className="flex items-center m-2 gap-1 cursor-pointer text-sm text-zinc-300 hover:text-white"
                >
                    <SettingsIcon className="w-4 h-4 text-zinc-300" />
                    <span>Settings</span>
                </Link>
            </div>

            {/* Conteúdo Principal */}
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
                    <span className="text-zinc-300">
                        {activeFile?.split("/").pop()}
                    </span>
                </div>
                <div className="flex-1 h-full">
                    <textarea
                        className="bg-transparent w-full h-full p-3 pt-0 text-white outline-none resize-none rounded-md shadow-md"
                        autoFocus
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
