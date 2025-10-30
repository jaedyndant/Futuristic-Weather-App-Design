import React from 'react';

interface SafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface SafeComponentState {
  hasError: boolean;
  error?: Error;
}

export class SafeComponent extends React.Component<SafeComponentProps, SafeComponentState> {
  constructor(props: SafeComponentProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SafeComponentState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SafeComponent caught error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-500 text-sm">
          Component failed to render
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundaries
export function withSafeComponent<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function SafeWrappedComponent(props: P) {
    return (
      <SafeComponent fallback={fallback}>
        <Component {...props} />
      </SafeComponent>
    );
  };
}