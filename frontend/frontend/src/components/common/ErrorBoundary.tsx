import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; err?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: any) { return { hasError: true, err }; }
  componentDidCatch(err: any, info: any) { console.error('[ErrorBoundary]', err, info); }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <h3>Something went wrong.</h3>
          <p style={{ color: '#b00' }}>{String(this.state.err?.message || '')}</p>
          <button onClick={() => this.setState({ hasError: false, err: undefined })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
