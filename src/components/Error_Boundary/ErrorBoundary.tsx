import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

// elkapja a renderelés közbeni hibákat, 
// így fehér képernyő helyett hibaüzenet látható
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    // hibánál true-ra állítjuk a hasError-t
    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    // konzol error-t dob
    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("React error:", error, info);
    }

    // feltételes renderelés és stílus
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
                    color: "$main-text-color"
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