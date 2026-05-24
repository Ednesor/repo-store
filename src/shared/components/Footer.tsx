export default function Footer() {
    return (
        <footer className="w-full py-lg px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter bg-surface-container-lowest border-t border-outline-variant mt-auto">
            <div className="col-span-1 md:col-span-1 flex flex-col gap-sm">
                <span className="text-headline-md font-headline-md font-bold text-on-surface">Retail Precision</span>
                <span className="text-body-sm font-body-sm text-on-surface-variant">© 2024 Retail Precision. All rights reserved.</span>
            </div>
            <div className="col-span-1 md:col-span-3 flex flex-wrap gap-gutter md:justify-end">
                <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
                <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
                <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Shipping Info</a>
                <a className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Us</a>
            </div>
        </footer>
    );
}
