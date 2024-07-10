interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-75" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-md shadow-md w-full max-w-md z-10 dark:bg-gray-800 dark:text-gray-200">
        {children}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Modal;
