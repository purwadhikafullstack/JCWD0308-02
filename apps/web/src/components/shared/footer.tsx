import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto bg-muted/40 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; 2024 Grosirun App. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
