import React from 'react';

interface Props {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<Props> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-4">حدث خطأ غير متوقع</h1>
        <p className="text-gray-300 mb-6">
          عذراً، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.
        </p>
        <div className="bg-gray-700 rounded p-3 mb-6 text-left">
          <code className="text-red-400 text-sm">{error.message}</code>
        </div>
        <button
          onClick={resetError}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;