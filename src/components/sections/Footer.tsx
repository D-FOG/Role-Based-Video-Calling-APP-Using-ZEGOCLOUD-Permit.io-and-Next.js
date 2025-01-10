import React from "react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="mb-4 md:mb-0">
            <Image src="/img/logo.png" alt="MeetHub Logo" width={100} height={20} />
          </Link>
          <nav>
            <ul className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <li>
                <Link href="#" className="hover:text-blue-300 transition-colors duration-200">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-300 transition-colors duration-200">
                  Testimonial
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-300 transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-300 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-300 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm text-blue-300">
          &copy; {new Date().getFullYear()} MeetHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;



