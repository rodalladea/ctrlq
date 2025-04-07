import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

function Homepage() {
    return (
        <div className="w-full h-screen flex">
            <textarea
                className="w-full h-full p-3 text-white outline-none resize-none bg-gray-900 bg-opacity-90 rounded-md shadow-md"
                placeholder="Enter your text here"
                autoFocus
                spellCheck={false}
            />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
            </Routes>
        </Router>
    );
}
