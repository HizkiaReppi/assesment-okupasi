import React from 'react';

interface ErrorNotificationProps {
    message: string | string[];
    onClose: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onClose }) => {
    const renderMessages = () => {
        if (Array.isArray(message)) {
            return message.map((msg, index) => <div key={index}>{msg}</div>);
        }
        return <div>{message}</div>;
    };

    return (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 dark:bg-red-800 dark:text-gray-200">
            <div className="flex justify-between items-center">
                <div>{renderMessages()}</div>
                <button onClick={onClose} className="ml-4 text-gray-100 hover:text-gray-300 dark:text-gray-300 dark:hover:text-gray-400">
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
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ErrorNotification;
