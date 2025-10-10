import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-[var(--background)] text-[var(--foreground)] mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-12">
        {/* Logo + copyright */}
        <div className="flex flex-col items-start md:col-span-1">
          <div className="flex items-center gap-2">
            <Image
              src="https://imkamran.com/wp-content/uploads/2023/09/cropped-Kamran-Akram-logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="font-heading text-lg font-bold text-[var(--foreground)]">
              DR.KAMRAN
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            © {new Date().getFullYear()} DR.KAMRAN. All rights reserved.
          </p>

          {/* (Optional) Social Icons */}
          {/* You can add icons here later if needed */}
        </div>

        {/* Column 1 */}
        <div>
          <h4 className="font-semibold mb-4 text-[var(--foreground)]">More</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
            <li>
              <Link href="/about" className="hover:text-orange-500 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="hover:text-orange-500 transition-colors">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-500 transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-orange-500 transition-colors">
                My Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-semibold mb-4 text-[var(--foreground)]">Free Content</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
            <li>
              <Link href="/newsletter" className="hover:text-orange-500 transition-colors">
                Newsletter
              </Link>
            </li>
            <li>
              <Link href="/articles" className="hover:text-orange-500 transition-colors">
                Articles & Guides
              </Link>
            </li>
            <li>
              <Link href="/podcast" className="hover:text-orange-500 transition-colors">
                Podcast
              </Link>
            </li>
            <li>
              <Link href="/videos" className="hover:text-orange-500 transition-colors">
                Videos
              </Link>
            </li>
            <li>
              <Link href="/book-notes" className="hover:text-orange-500 transition-colors">
                Book Notes
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-semibold mb-4 text-[var(--foreground)]">Products</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
            <li>
              <Link href="/book" className="hover:text-orange-500 transition-colors">
                My Book
              </Link>
            </li>
            <li>
              <Link href="/academy" className="hover:text-orange-500 transition-colors">
                YouTube Academy
              </Link>
            </li>
            <li>
              <Link href="/lifeos" className="hover:text-orange-500 transition-colors">
                LifeOS
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
        <Link href="/privacy" className="hover:text-orange-500 transition-colors">
          Privacy Policy
        </Link>
        {" / "}
        <Link href="/cookies" className="hover:text-orange-500 transition-colors">
          Cookie Policy
        </Link>
      </div>
    </footer>
  );
}
