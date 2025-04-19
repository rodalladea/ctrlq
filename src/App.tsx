import {
    MemoryRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";
import Settings from "./pages/Settings";
import { useEffect } from "react";
import Home from "./pages/Home";

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
            <Route path="/" element={<Home />} />
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
