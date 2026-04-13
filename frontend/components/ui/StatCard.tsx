interface StatCardProps {
    label: string;
    value: number;
    unit: string;
    icon: string;
}

export default function StatCard({ label, value, unit, icon }: StatCardProps) {
    return (
        <div
            className="rounded-2xl px-5 py-4 border flex items-center gap-4"
            style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
            }}
        >
            <span className="text-3xl">{icon}</span>
            <div>
                <p
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    {label}
                </p>
                <p
                    className="text-2xl font-black"
                    style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    {value}
                    <span
                        className="text-sm font-medium ml-1"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                    >
                        {unit}
                    </span>
                </p>
            </div>
        </div>
    );
}