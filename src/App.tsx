import {
    MemoryRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
} from "react-router-dom";
import Settings from "./pages/Settings";
import { FileText, Folder, Menu, SettingsIcon } from "lucide-react";
import { useState, useEffect } from "react";

function Homepage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="w-full h-screen flex overflow-hidden">
            <div
                className={`w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } fixed top-0 left-0 h-full z-10 flex flex-col justify-between`}
            >
                <div>
                    <div className="flex p-2 items-center gap-2">
                        <Folder
                            strokeWidth={3}
                            className="w-4 h-4 text-gray-300"
                        />
                        <span className="text-gray-300">Folder</span>
                    </div>
                    <div className="px-2">
                        <Link
                            to="/settings"
                            className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:bg-gray-700 rounded-md px-2 py-1"
                        >
                            <FileText className="w-4 h-4 text-gray-300" />
                            <span>file.md</span>
                        </Link>
                    </div>
                </div>

                <Link
                    to="/settings"
                    className="flex items-center m-2 gap-1 cursor-pointer text-sm text-gray-300 hover:text-white"
                >
                    <SettingsIcon className="w-4 h-4 text-gray-300" />
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
                        className="cursor-pointer text-gray-300 hover:text-white flex items-center"
                    >
                        <Menu strokeWidth={2} className="w-6 h-6" />
                    </button>
                    <span className="text-gray-300">file.md</span>
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
}

function AppContent() {
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for navigation events from the main process
        window.electronAPI.onNavigateToSettings(() => {
            navigate("/settings");
        });
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
