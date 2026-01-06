export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });

        clearTimeout(timeout);

        if (!res.ok) {
            const errorData = await safeJson(res);
            throw new Error(errorData?.message || `API error: ${res.status}`);
        }

        const data = await safeJson<T>(res);
        if (data === null) throw new Error("Invalid JSON response");

        return data;
    } catch (err: any) {
        if (err.name === "AbortError") {
            throw new Error("Request timeout");
        }

        throw new Error(err.message || "Network error");
    }
}

async function safeJson<T = any>(res: Response): Promise<T | null> {
    try {
        return await res.json();
    } catch {
        return null;
    }
}