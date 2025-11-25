import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("React error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "20px",
                    color: "var(--main-text)"
                }}>
                    <h1>Something went wrong</h1>
                    <p>Try reloading the page.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;