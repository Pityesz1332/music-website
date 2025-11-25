export async function apiFetch(url, options = {}) {
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

        return await safeJson(res);
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error("Request timeout");
        }

        throw new Error(err.message || "Network error");
    }
}

async function safeJson(res) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}