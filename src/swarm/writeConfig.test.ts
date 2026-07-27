import { describe, it, expect, beforeEach, vi } from "vitest";
import { setWriteUrl, getWriteUrl, hasWriteUrl, clearWriteUrl, subscribeToWriteUrl } from "./writeConfig";

beforeEach(() => {
    clearWriteUrl();
});

describe("setWriteUrl", () => {
    it("stores a valid http(s) URL", () => {
        setWriteUrl("http://localhost:1633");
        expect(getWriteUrl()).toBe("http://localhost:1633");
        expect(hasWriteUrl()).toBe(true);
    });

    it("trims surrounding whitespace", () => {
        setWriteUrl("  https://bee.example.com  ");
        expect(getWriteUrl()).toBe("https://bee.example.com");
    });

    it("rejects an empty value", () => {
        expect(() => setWriteUrl("   ")).toThrow(/empty/);
        expect(hasWriteUrl()).toBe(false);
    });

    it("rejects unparsable input", () => {
        expect(() => setWriteUrl("not a url")).toThrow();
        expect(hasWriteUrl()).toBe(false);
    });

    it("rejects non-http(s) schemes", () => {
        expect(() => setWriteUrl("ftp://bee.example.com")).toThrow(/http/);
        expect(hasWriteUrl()).toBe(false);
    });
});

describe("clearWriteUrl", () => {
    it("removes the configured URL", () => {
        setWriteUrl("http://localhost:1633");
        clearWriteUrl();

        expect(getWriteUrl()).toBeNull();
        expect(hasWriteUrl()).toBe(false);
    });
});

describe("subscribeToWriteUrl", () => {
    it("notifies listeners on set and clear", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeToWriteUrl(listener);

        setWriteUrl("http://localhost:1633");
        expect(listener).toHaveBeenCalledTimes(1);

        clearWriteUrl();
        expect(listener).toHaveBeenCalledTimes(2);

        unsubscribe();
        setWriteUrl("http://localhost:1633");
        expect(listener).toHaveBeenCalledTimes(2);
    });
});
