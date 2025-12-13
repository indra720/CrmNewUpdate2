export function Footer() {
    return (
        <footer className="border-t py-4">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
                    <p>&copy; {new Date().getFullYear()} NexusCRM. All rights reserved.</p>
                    <p>Version 1.0.0</p>
                </div>
            </div>
        </footer>
    );
}
