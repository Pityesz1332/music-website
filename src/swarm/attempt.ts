/**
 * Supersedable attempts: only the latest attempt may act on its results.
 *
 * Ceremony handlers (passkey prompts and the async work that follows) must not
 * apply side effects once the user cancelled, retried, or navigated away. A
 * hand-rolled "is this still the latest call" counter relies on remembering a
 * re-check after every await, which is easy to forget. This helper makes the
 * check structural: route every await through `attempt.guard(...)` and a
 * stale continuation throws instead of proceeding.
 *
 * Usage:
 *
 *   const attempts = createAttemptTracker();
 *
 *   async function confirm() {
 *     const attempt = attempts.begin();
 *     try {
 *       const key = await attempt.guard(ceremony());
 *       applySideEffects(key);
 *     } catch (caught) {
 *       if (attempt.current) {
 *         error = message(caught);
 *       }
 *     }
 *   }
 *
 *   function cancel() {
 *     attempts.supersede();
 *   }
 *
 * `guard` does not cancel the underlying work — like the counter it replaces,
 * it discards the result once the work settles. Pair it with an
 * `AbortController` when the work itself supports cancellation (WebAuthn's
 * `navigator.credentials` calls do); `guard` alone only stops a *resolved*
 * stale result from being acted on.
 */

/**
 * Thrown by `Attempt.guard` when the attempt was superseded while its work ran.
 * It is only ever thrown once `current` is false, so catch blocks gated on
 * `attempt.current` swallow it without needing an instanceof check.
 */
export class SupersededError extends Error {
    constructor() {
        super("Attempt superseded by cancel, retry, or leaving the page");
        this.name = "SupersededError";
    }
}

export interface Attempt {
    /** True while no newer attempt (begin) or cancel (supersede) replaced this one. */
    readonly current: boolean;
    /**
     * Resolve `work`, then throw `SupersededError` if this attempt is no
     * longer current. A rejection of `work` propagates unchanged.
     */
    guard<T>(work: Promise<T>): Promise<T>;
}

export interface AttemptTracker {
    /** Start a new attempt, superseding any attempt currently in flight. */
    begin(): Attempt;
    /** Invalidate all in-flight attempts without starting a new one (cancel/close/leave). */
    supersede(): void;
}

export function createAttemptTracker(): AttemptTracker {
    let latest = 0;
    return {
        begin(): Attempt {
            const mine = ++latest;
            return {
                get current() {
                    return mine === latest;
                },
                async guard<T>(work: Promise<T>): Promise<T> {
                    const value = await work;
                    if (mine !== latest) {
                        throw new SupersededError();
                    }
                    return value;
                },
            };
        },
        supersede() {
            latest++;
        },
    };
}
