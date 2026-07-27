let writeUrl: string | null = null;

const listeners = new Set<() => void>();

function notify(): void {
    for (const listener of listeners) listener();
}

export function subscribeToWriteUrl(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function setWriteUrl(url: string): void {
    const trimmed = url.trim();
    if (!trimmed) throw new Error("Bee node URL is empty");

    let parsed: URL;
    try {
        parsed = new URL(trimmed);
    } catch {
        throw new Error("Invalid URL");
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Bee node URL must be http or https");
    }

    writeUrl = trimmed;
    notify();
}

export function getWriteUrl(): string | null {
    return writeUrl;
}

export function hasWriteUrl(): boolean {
    return writeUrl !== null;
}

export function clearWriteUrl(): void {
    writeUrl = null;
    notify();
}
