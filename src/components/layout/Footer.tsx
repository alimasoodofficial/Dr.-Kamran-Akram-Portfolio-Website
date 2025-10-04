// src/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-12">
        {/* Logo + copyright */}
        <div className="flex flex-col items-start md:col-span-1">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png" // 🔥 replace with your logo
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="font-heading text-lg font-bold">DR.KAMRAN</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            © {new Date().getFullYear()} DR.KAMRAN. All rights reserved.
          </p>

          {/* Social Icons */}
         
        </div>

        {/* Column 1 */}
        <div>
          <h4 className="font-semibold mb-4">More</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/about" className="hover:text-black">About</Link></li>
            <li><Link href="/jobs" className="hover:text-black">Jobs</Link></li>
            <li><Link href="/contact" className="hover:text-black">Contact</Link></li>
            <li><Link href="/account" className="hover:text-black">My Account</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-semibold mb-4">Free Content</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/newsletter" className="hover:text-black">Newsletter</Link></li>
            <li><Link href="/articles" className="hover:text-black">Articles & Guides</Link></li>
            <li><Link href="/podcast" className="hover:text-black">Podcast</Link></li>
            <li><Link href="/videos" className="hover:text-black">Videos</Link></li>
            <li><Link href="/book-notes" className="hover:text-black">Book Notes</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-semibold mb-4">Products</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/book" className="hover:text-black">My Book</Link></li>
            <li><Link href="/academy" className="hover:text-black">YouTube Academy</Link></li>
            <li><Link href="/lifeos" className="hover:text-black">LifeOS</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t mt-6 py-4 text-center text-xs text-gray-500">
        <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
        {" / "}
        <Link href="/cookies" className="hover:text-black">Cookie Policy</Link>
      </div>
    </footer>
  );
}
