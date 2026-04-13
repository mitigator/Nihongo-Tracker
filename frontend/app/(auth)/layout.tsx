import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            {/* Theme toggle — fixed top right on all auth pages */}
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            {children}
        </div>
    );
}