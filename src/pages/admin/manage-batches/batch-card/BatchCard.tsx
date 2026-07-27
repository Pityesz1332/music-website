import { AlertTriangle, Clock, Database, Pin } from "lucide-react";
import type { PostageBatchInfo } from "@interfaces/swarm";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { ADMIN_BATCHES_STRINGS } from "@i18n/ui/admin/batches";
import { isExpired } from "../../../../swarm/batchSelection";
import {
    formatTimeLeft,
    shortenBatchId,
    ttlBarFraction,
    ttlHealth,
    usagePercent,
    TTL_SCALE_DAYS,
} from "@utils/batchFormat";

interface BatchCardProps {
    batch: PostageBatchInfo;
    isActive?: boolean;
    isPinned?: boolean;
    onPin?: (batchId: string) => void;
    onUnpin?: () => void;
}

export const BatchCard = ({
    batch,
    isActive = false,
    isPinned = false,
    onPin,
    onUnpin,
}: BatchCardProps) => {
    const health = ttlHealth(batch.ttlSeconds);
    const timeLeft = formatTimeLeft(batch.ttlSeconds);
    const ttlWidth = ttlBarFraction(batch.ttlSeconds) * 100;
    const usedPercent = usagePercent(batch.usage);
    const isFull = batch.usage >= 1;

    const warnings = [
        health === "expired" && ADMIN_BATCHES_STRINGS.WARNINGS.EXPIRED,
        (health === "critical" || health === "warning") && ADMIN_BATCHES_STRINGS.WARNINGS.EXPIRING,
        isFull && ADMIN_BATCHES_STRINGS.WARNINGS.FULL,
        !batch.usable && ADMIN_BATCHES_STRINGS.WARNINGS.UNUSABLE,
    ].filter(Boolean) as string[];

    return (
        <article className={`batch-card${isActive ? " batch-card--active" : ""}`}>
            <header className="batch-card__header">
                <h2 className="batch-card__label">
                    {batch.label || ADMIN_BATCHES_STRINGS.CARD.UNLABELLED}
                </h2>
                <div className="batch-card__badges">
                    {isActive && (
                        <span className="batch-card__badge batch-card__badge--active">
                            {ADMIN_BATCHES_STRINGS.BADGES.ACTIVE}
                        </span>
                    )}
                    {isPinned && (
                        <span className="batch-card__badge batch-card__badge--pinned">
                            {ADMIN_BATCHES_STRINGS.BADGES.PINNED}
                        </span>
                    )}
                    <span className={`batch-card__badge batch-card__badge--${batch.usable ? "ok" : "bad"}`}>
                        {batch.usable
                            ? ADMIN_BATCHES_STRINGS.BADGES.USABLE
                            : ADMIN_BATCHES_STRINGS.BADGES.UNUSABLE}
                    </span>
                    <span className="batch-card__badge batch-card__badge--neutral">
                        {batch.immutable
                            ? ADMIN_BATCHES_STRINGS.BADGES.IMMUTABLE
                            : ADMIN_BATCHES_STRINGS.BADGES.MUTABLE}
                    </span>
                </div>
            </header>

            <p className="batch-card__id">
                <span className="batch-card__id-label">{ADMIN_BATCHES_STRINGS.CARD.BATCH_ID}</span>
                <code title={batch.batchId}>{shortenBatchId(batch.batchId)}</code>
            </p>

            <section className="batch-card__meter">
                <div className="batch-card__meter-head">
                    <span className="batch-card__meter-title">
                        <Clock size={15} /> {ADMIN_BATCHES_STRINGS.CARD.TIME_LEFT}
                    </span>
                    <span className={`batch-card__meter-value batch-card__meter-value--${health}`}>
                        {timeLeft ?? ADMIN_BATCHES_STRINGS.CARD.TIME_UNKNOWN}
                    </span>
                </div>
                <div
                    className="batch-card__bar"
                    role="progressbar"
                    aria-label={ADMIN_BATCHES_STRINGS.CARD.TIME_LEFT}
                    aria-valuemin={0}
                    aria-valuemax={TTL_SCALE_DAYS}
                    aria-valuenow={batch.ttlSeconds === null ? undefined : batch.ttlSeconds / 86400}
                    aria-valuetext={timeLeft ?? ADMIN_BATCHES_STRINGS.CARD.TIME_UNKNOWN}
                >
                    <div
                        className={`batch-card__bar-fill batch-card__bar-fill--${health}`}
                        style={{ width: `${ttlWidth}%` }}
                    />
                </div>
                <p className="batch-card__scale">{ADMIN_BATCHES_STRINGS.CARD.TTL_SCALE}</p>
            </section>

            <section className="batch-card__meter">
                <div className="batch-card__meter-head">
                    <span className="batch-card__meter-title">
                        <Database size={15} /> {ADMIN_BATCHES_STRINGS.CARD.CAPACITY}
                    </span>
                    <span className={`batch-card__meter-value${isFull ? " batch-card__meter-value--critical" : ""}`}>
                        {usedPercent}%
                    </span>
                </div>
                <div
                    className="batch-card__bar"
                    role="progressbar"
                    aria-label={ADMIN_BATCHES_STRINGS.CARD.CAPACITY}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={usedPercent}
                >
                    <div
                        className={`batch-card__bar-fill batch-card__bar-fill--${isFull ? "critical" : "usage"}`}
                        style={{ width: `${usedPercent}%` }}
                    />
                </div>
            </section>

            <dl className="batch-card__facts">
                <div className="batch-card__fact">
                    <dt>{ADMIN_BATCHES_STRINGS.CARD.DEPTH}</dt>
                    <dd>{batch.depth}</dd>
                </div>
                <div className="batch-card__fact">
                    <dt>{ADMIN_BATCHES_STRINGS.CARD.UTILIZATION}</dt>
                    <dd>{batch.utilization} / {2 ** (batch.depth - batch.bucketDepth)}</dd>
                </div>
                <div className="batch-card__fact">
                    <dt>{ADMIN_BATCHES_STRINGS.CARD.AMOUNT}</dt>
                    <dd>{batch.amount}</dd>
                </div>
            </dl>

            {isActive && (
                <p className="batch-card__active-note">
                    {ADMIN_BATCHES_STRINGS.ACTIVE_NOTE}
                    {!isPinned && ` ${ADMIN_BATCHES_STRINGS.AUTO_NOTE}`}
                </p>
            )}

            {warnings.map((warning) => (
                <p key={warning} className="batch-card__warning">
                    <AlertTriangle size={15} /> {warning}
                </p>
            ))}

            <footer className="batch-card__actions">
                {isPinned ? (
                    <PrimaryButton className="batch-card__action" onClick={onUnpin}>
                        {ADMIN_BATCHES_STRINGS.ACTIONS.UNPIN}
                    </PrimaryButton>
                ) : (
                    <PrimaryButton
                        className="batch-card__action"
                        onClick={() => onPin?.(batch.batchId)}
                        disabled={!batch.usable || isExpired(batch)}
                    >
                        <Pin size={15} /> {ADMIN_BATCHES_STRINGS.ACTIONS.PIN}
                    </PrimaryButton>
                )}
            </footer>
        </article>
    );
};
