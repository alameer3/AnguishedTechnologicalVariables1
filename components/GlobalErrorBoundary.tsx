import React, { Component, ReactNode } from 'react';
import { logError } from '../utils/errorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, 'Global Error Boundary');
    
    // Log component stack for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center text-white max-w-md px-6">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-red-600 mb-4">خطأ</h1>
              <h2 className="text-2xl font-semibold mb-4">حدث خطأ غير متوقع</h2>
              <p className="text-gray-300 mb-6">
                نعتذر، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                إعادة تحميل الصفحة
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                العودة للصفحة السابقة
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-red-400 cursor-pointer">
                  تفاصيل الخطأ (وضع التطوير)
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 rounded text-xs text-red-300 overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;