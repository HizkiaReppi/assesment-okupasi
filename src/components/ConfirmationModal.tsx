interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
