"use client";

import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-indigo-600 dark:text-indigo-400 hover:scale-105 transform transition-all"
        >
          <span>Viberfy</span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          {[
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 🌐 Соцсети */}
        <div className="flex gap-4 text-gray-500 dark:text-gray-400">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>

      </div>

      {/* © Copyright */}
      <div className="border-t border-gray-100 dark:border-gray-800 mt-4 py-4 text-center text-xs text-gray-500 dark:text-gray-500">
        © {year} <span className="font-semibold text-indigo-600 dark:text-indigo-400">Viberfy</span>. All rights reserved.
      </div>
    </footer>
  );
}
