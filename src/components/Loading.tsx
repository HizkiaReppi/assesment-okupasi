import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-500 dark:border-gray-300"></div>
    </div>
  );
};

export default Loading;
