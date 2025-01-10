"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/img/logo.png"
              alt="Logo"
              width={100}
              height={20}
              className="transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </Link>
          <button
            className="lg:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav
            className={`fixed inset-y-0 right-0 z-20 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:shadow-none lg:transform-none lg:static lg:flex lg:w-auto lg:items-center lg:space-x-8 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-5 lg:hidden">
              <button
                className="absolute top-4 right-4 p-2 text-blue-600 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 p-5 lg:p-0">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-400 transition-colors duration-200">How it works</a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-400 transition-colors duration-200">Testimonial</a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-400 transition-colors duration-200">Features</a>
              </li>
            </ul>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 p-5 lg:p-0 mt-4 lg:mt-0">
              <Link href="/signin">
                <Button variant="outline" className="w-full lg:w-auto border-blue-500 text-blue-500 hover:bg-blue-50">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full lg:w-auto bg-blue-500 hover:bg-blue-600 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default NavBar;

