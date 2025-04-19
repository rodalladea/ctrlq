import { useEffect, useRef } from "react";
import { Ellipsis } from "lucide-react";

export interface DropdownProps {
    onDelete: () => void;
    isOpen?: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
    onDelete,
    isOpen = false,
    onOpenChange,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onOpenChange(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [onOpenChange, isOpen]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onOpenChange(!isOpen);
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
                    className="absolute top-3 left-3 mt-1 w-40 bg-zinc-800 rounded-md shadow-lg z-50"
                >
                    <div className="p-1">
                        <button
                            onClick={onDelete}
                            className="w-full text-left text-zinc-300 hover:text-red-500 hover:bg-zinc-700 px-2 py-1 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
