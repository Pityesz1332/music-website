import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AdminProvider, useAdmin } from "./AdminContext";
import { clearFeedKey, getFeedKey } from "../swarm/feedKey";

const OWNER_KEY_HEX = "4646464646464646464646464646464646464646464646464646464646464646";
const STRANGER_KEY_HEX = "1111111111111111111111111111111111111111111111111111111111111111";

vi.mock("./LoadingContext", () => ({
    useLoading: () => ({ showLoading: vi.fn(), hideLoading: vi.fn() }),
}));

vi.mock("../swarm/swarmService", () => ({
    FEED_OWNER_ADDRESS: "9d8a62f656a8d1615c1294fd71e9cfb3e4855a4f",
}));

const mockUnlockFeedKey = vi.fn();
const mockHasEnrolledPasskey = vi.fn(() => true);
const mockIsPasskeySupported = vi.fn(() => true);

vi.mock("../swarm/passkeyAuth", () => ({
    unlockFeedKey: () => mockUnlockFeedKey(),
    hasEnrolledPasskey: () => mockHasEnrolledPasskey(),
    isPasskeySupported: () => mockIsPasskeySupported(),
}));

const TestComponent = () => {
    const { isAdmin, error, canUsePasskey, signInWithPasskey, signInWithRawKey, disconnectAdmin } = useAdmin();
    return (
        <div>
            <div data-testid="status">{isAdmin ? "admin" : "guest"}</div>
            <div data-testid="error">{error}</div>
            <div data-testid="can-passkey">{canUsePasskey ? "yes" : "no"}</div>
            <button onClick={signInWithPasskey}>Passkey</button>
            <button onClick={() => signInWithRawKey(OWNER_KEY_HEX)}>Owner Key</button>
            <button onClick={() => signInWithRawKey(STRANGER_KEY_HEX)}>Stranger Key</button>
            <button onClick={() => signInWithRawKey("not-a-key")}>Bad Key</button>
            <button onClick={disconnectAdmin}>Logout</button>
        </div>
    );
};

const renderAdmin = () =>
    render(
        <AdminProvider>
            <TestComponent />
        </AdminProvider>,
    );

const click = async (name: string) => {
    await act(async () => {
        screen.getByText(name).click();
    });
};

const status = () => screen.getByTestId("status").textContent;

beforeEach(() => {
    clearFeedKey();
    vi.clearAllMocks();
    mockHasEnrolledPasskey.mockReturnValue(true);
    mockIsPasskeySupported.mockReturnValue(true);
});

describe("AdminProvider", () => {
    it("starts as a guest with no key loaded", () => {
        renderAdmin();
        expect(status()).toBe("guest");
        expect(screen.getByTestId("error").textContent).toBe("");
    });

    it("offers the passkey path only when one is enrolled and supported", () => {
        mockHasEnrolledPasskey.mockReturnValue(false);
        renderAdmin();
        expect(screen.getByTestId("can-passkey").textContent).toBe("no");
    });
});

describe("passkey sign-in", () => {
    it("unseals the feed key, so signing in also enables publishing", async () => {
        mockUnlockFeedKey.mockResolvedValue(OWNER_KEY_HEX);
        renderAdmin();

        await click("Passkey");

        expect(status()).toBe("admin");
        expect(getFeedKey()).not.toBeNull();
    });

    it("stays a guest when the passkey does not unseal", async () => {
        mockUnlockFeedKey.mockRejectedValue(new Error("Could not unlock the feed key with this passkey."));
        renderAdmin();

        await click("Passkey");

        expect(status()).toBe("guest");
        expect(getFeedKey()).toBeNull();
        expect(screen.getByTestId("error").textContent).toMatch(/Could not unlock/);
    });
});

describe("raw key sign-in", () => {
    it("accepts the configured feed owner's key", async () => {
        renderAdmin();
        await click("Owner Key");

        expect(status()).toBe("admin");
        expect(getFeedKey()).not.toBeNull();
    });

    it("rejects a valid key that is not the feed owner, and loads nothing", async () => {
        renderAdmin();
        await click("Stranger Key");

        expect(status()).toBe("guest");
        expect(getFeedKey()).toBeNull();
        expect(screen.getByTestId("error").textContent).toMatch(/does not match/);
    });

    it("rejects malformed key material", async () => {
        renderAdmin();
        await click("Bad Key");

        expect(status()).toBe("guest");
        expect(getFeedKey()).toBeNull();
    });
});

describe("disconnect", () => {
    it("wipes the key from memory", async () => {
        renderAdmin();
        await click("Owner Key");
        expect(status()).toBe("admin");

        await click("Logout");

        expect(status()).toBe("guest");
        expect(getFeedKey()).toBeNull();
    });
});

describe("admin state is derived from the key", () => {
    it("drops to guest when the key is cleared outside React", async () => {
        renderAdmin();
        await click("Owner Key");
        expect(status()).toBe("admin");

        await act(async () => {
            clearFeedKey();
        });

        expect(status()).toBe("guest");
    });
});

describe("useAdmin", () => {
    it("throws outside of a provider", () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<TestComponent />)).toThrow("useAdmin must be used within an AdminProvider");
    });
});
