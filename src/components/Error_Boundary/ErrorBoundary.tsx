import { ErrorBoundary } from "react-error-boundary";

export const ErrorFallback = () => {
    return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "20px",
            color: "#fff"
        }}>
            <h1>Something went wrong</h1>
            <p>Try reloading the page.</p>
            <button onClick={() => window.location.reload()}>Reload</button>
        </div>
    );
}