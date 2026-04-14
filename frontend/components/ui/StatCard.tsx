interface StatCardProps {
    label: string;
    value: number;
    unit: string;
    icon: string;
}

export default function StatCard({ label, value, unit, icon }: StatCardProps) {
    return (
        <div className="rounded-2xl border flex items-center gap-4 w-full bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.25rem 1.5rem" }}>
            <span className="text-3xl lg:text-4xl leading-none shrink-0">{icon}</span>
            <div className="min-w-0">
                <p className="font-black uppercase tracking-widest text-[0.55rem] lg:text-[0.65rem] text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                    {label}
                </p>
                <p className="font-black text-2xl lg:text-3xl leading-none text-[var(--color-text)] font-[var(--font-orbitron)]">
                    {value}
                    <span className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] ml-1">
                        {unit}
                    </span>
                </p>
            </div>
        </div>
    );
}