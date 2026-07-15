import { Suspense } from "react";
import { LoadingState } from "@components/loading-state/LoadingState";

interface RouteSuspenseProps {
    children: React.ReactNode;
    message?: string;
}

export const RouteSuspense = ({ children, message }: RouteSuspenseProps) => {
    return (
        <Suspense fallback={<LoadingState message={message} />}>
            {children}
        </Suspense>
    );
};