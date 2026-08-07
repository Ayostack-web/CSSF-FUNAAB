'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#071026] via-[#0a1a35] to-[#071026] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <AlertTriangle className="text-blue-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-blue-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. Please try again or return to the
              home page.
            </p>
            <details className="mb-6 text-left text-sm text-gray-500">
              <summary className="cursor-pointer font-semibold">
                Error details
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-auto text-xs">
                {this.state.error?.message}
              </pre>
            </details>
            <div className="flex gap-3">
              <Link href="/" className="btn-cta flex-1 px-4 py-2 no-underline">
                Home
              </Link>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
