const Excalidraw: React.FC = () => {
    return (
        <div className="w-full h-screen flex overflow-hidden">
            <iframe
                src="https://excalidraw.com"
                className="w-full h-full"
                title="Excalidraw"
            />
        </div>
    );
};

export default Excalidraw;
