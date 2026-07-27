import { RefreshCw } from "lucide-react";
import { useBatches } from "@hooks/admin/useBatches";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { ADMIN_BATCHES_STRINGS } from "@i18n/ui/admin/batches";
import { BatchCard } from "./batch-card/BatchCard";
import "./ManageBatches.scss";

export const ManageBatches = () => {
    const {
        batches,
        loading,
        error,
        writeUrlSet,
        refresh,
        activeBatchId,
        pinnedBatchId,
        pinnedIgnored,
        pinBatch,
        unpinBatch,
    } = useBatches();

    return (
        <div className="manage-batches">
            <header className="manage-batches__header">
                <div>
                    <h1 className="manage-batches__title">{ADMIN_BATCHES_STRINGS.TITLE}</h1>
                    <p className="manage-batches__subtitle">{ADMIN_BATCHES_STRINGS.SUBTITLE}</p>
                </div>
                <PrimaryButton
                    className="manage-batches__refresh"
                    onClick={refresh}
                    disabled={loading || !writeUrlSet}
                >
                    <RefreshCw size={16} />
                    {loading
                        ? ADMIN_BATCHES_STRINGS.ACTIONS.REFRESHING
                        : ADMIN_BATCHES_STRINGS.ACTIONS.REFRESH}
                </PrimaryButton>
            </header>

            {!writeUrlSet && (
                <p className="manage-batches__status">{ADMIN_BATCHES_STRINGS.STATUS.NO_WRITE_URL}</p>
            )}

            {writeUrlSet && loading && batches.length === 0 && (
                <p className="manage-batches__status">{ADMIN_BATCHES_STRINGS.STATUS.LOADING}</p>
            )}

            {error && <p className="manage-batches__error">{error}</p>}

            {writeUrlSet && !loading && !error && batches.length === 0 && (
                <p className="manage-batches__status">{ADMIN_BATCHES_STRINGS.STATUS.EMPTY}</p>
            )}

            {batches.length > 0 && !activeBatchId && (
                <p className="manage-batches__error">{ADMIN_BATCHES_STRINGS.NO_ACTIVE}</p>
            )}

            {pinnedIgnored && (
                <p className="manage-batches__warning">{ADMIN_BATCHES_STRINGS.PINNED_IGNORED}</p>
            )}

            <div className="manage-batches__grid">
                {batches.map((batch) => (
                    <BatchCard
                        key={batch.batchId}
                        batch={batch}
                        isActive={batch.batchId === activeBatchId}
                        isPinned={batch.batchId === pinnedBatchId}
                        onPin={pinBatch}
                        onUnpin={unpinBatch}
                    />
                ))}
            </div>
        </div>
    );
};
