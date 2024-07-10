interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75">
            <div className="bg-white p-6 rounded-md shadow-md dark:bg-gray-800">
                <p className="mb-4 text-gray-900 dark:text-gray-200">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Batal</button>
                    <button onClick={onConfirm} className="bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400 dark:bg-red-500 dark:text-red-100 dark:hover:bg-red-600">Lanjut</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
