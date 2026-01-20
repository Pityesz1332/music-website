// ez a kód backend-hez jól jöhet, úgyhogy megtartom
// védi a böngészőt. ha egy hívás lefagyna, 
// a 8mp-es timeout miatt nem akad el az egész oldal
export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    // timeout kezelése
    // 8mp után megszakítjuk a kérést
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

        // ha a kérés időben bejeződött, töröljük a memóriából
        clearTimeout(timeout);

        // http hibák kiolvasása és folyamat leállítása
        if (!res.ok) {
            const errorData = await safeJson(res);
            throw new Error(errorData?.message || `API error: ${res.status}`);
        }

        // sikeres válasz feldolgozása - alatta a catch-ben, hibakezelés
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

// ha a szerver válasza üres vagy nem valid, null-t ad vissza
async function safeJson<T = any>(res: Response): Promise<T | null> {
    try {
        return await res.json();
    } catch {
        return null;
    }
}