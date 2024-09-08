import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      <span className="ml-3 text-lg font-semibold">Loading...</span>
    </div>
  );
};

export default Loading;