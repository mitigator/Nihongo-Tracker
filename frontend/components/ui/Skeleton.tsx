interface SkeletonProps {
    className?: string;
    height?: string;
    width?: string;
    rounded?: string;
}

export default function Skeleton({
    className = "",
    height = "h-4",
    width = "w-full",
    rounded = "rounded-xl",
}: SkeletonProps) {
    return (
        <div
            className={`animate-pulse ${height} ${width} ${rounded} ${className}`}
            style={{ background: "var(--color-border)" }}
        />
    );
}

// ── Preset skeletons ─────────────────────────────────────────

export function StatCardSkeleton() {
    return (
        <div
            className="rounded-2xl border px-5 py-4 flex items-center gap-4"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
            <Skeleton height="h-8" width="w-8" rounded="rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton height="h-3" width="w-20" />
                <Skeleton height="h-6" width="w-16" />
            </div>
        </div>
    );
}

export function EntryCardSkeleton() {
    return (
        <div
            className="rounded-2xl border px-5 py-4 space-y-2"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
            <Skeleton height="h-3" width="w-28" />
            <div className="flex gap-4">
                <Skeleton height="h-3" width="w-16" />
                <Skeleton height="h-3" width="w-16" />
                <Skeleton height="h-3" width="w-16" />
            </div>
        </div>
    );
}

export function ProgressBarSkeleton() {
    return (
        <div
            className="rounded-2xl border px-5 py-4 space-y-3"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
            <div className="flex justify-between">
                <Skeleton height="h-3" width="w-20" />
                <Skeleton height="h-3" width="w-8" />
            </div>
            <Skeleton height="h-2" rounded="rounded-full" />
            <div className="flex justify-between">
                <Skeleton height="h-3" width="w-12" />
                <Skeleton height="h-3" width="w-16" />
            </div>
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div
            className="rounded-2xl border px-5 py-5 space-y-4"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
            <Skeleton height="h-3" width="w-32" />
            <div className="flex items-end gap-2 h-[180px]">
                {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                        <Skeleton
                            height={`h-[${20 + Math.random() * 120}px]`}
                            rounded="rounded-t-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}