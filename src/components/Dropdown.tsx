import { useEffect, useRef, useState } from "react";
import { Ellipsis, Pencil, Trash } from "lucide-react";

export interface DropdownProps {
    onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    onRename: (newName: string) => void | Promise<void>;
    fileName: string;
    isOpen?: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
    onDelete,
    onRename,
    fileName,
    isOpen = false,
    onOpenChange,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            // Set initial value to current filename without extension
            const nameWithoutExt = fileName.split(".").slice(0, -1).join(".");
            setNewName(nameWithoutExt);
            inputRef.current.select();
        }
    }, [isRenaming, fileName]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                // If renaming, submit the name on click outside
                if (isRenaming) {
                    handleRenameSubmit();
                }
                onOpenChange(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [onOpenChange, isOpen, isRenaming]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onOpenChange(!isOpen);
    };

    const handleRenameClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsRenaming(true);
    };

    const handleRenameSubmit = () => {
        if (newName.trim()) {
            // Get file extension
            const extension = fileName.split(".").pop();
            // Submit new name with original extension
            onRename(`${newName}.${extension}`);
        }
        setIsRenaming(false);
        onOpenChange(false);
    };

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={handleClick}
                className="flex items-center justify-center h-5 w-6 text-zinc-300 hover:text-white cursor-pointer"
            >
                <Ellipsis className="w-4 h-4" />
            </button>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-4 right-3 mt-1 w-40 bg-zinc-800 rounded-md shadow-lg z-50"
                >
                    <div className="p-1 space-y-1">
                        <button
                            onClick={handleRenameClick}
                            className="w-full text-left text-zinc-300 hover:text-white hover:bg-zinc-700 px-2 py-1 rounded flex items-center gap-2"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Rename
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(e);
                                onOpenChange(false);
                            }}
                            className="w-full text-left text-zinc-300 hover:text-red-500 hover:bg-zinc-700 px-2 py-1 rounded flex items-center gap-2"
                        >
                            <Trash className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
            {isRenaming && (
                <div className="absolute top-4 right-3 mt-1 z-50 w-full min-w-40">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameSubmit();
                            if (e.key === "Escape") {
                                setIsRenaming(false);
                                onOpenChange(false);
                            }
                        }}
                        className="w-full py-1 px-2 bg-zinc-700 rounded text-white outline-none border border-zinc-500 shadow-lg"
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
};

export default Dropdown;
