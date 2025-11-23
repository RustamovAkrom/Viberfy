import { useState, useRef, useEffect } from "react";
import { Share2, Facebook, Twitter, Mail, Send } from "lucide-react";
import { TrackType } from "@/types/tracksTypes";

interface TrackShareProps {
  track: TrackType;
}

export const TrackShare: React.FC<TrackShareProps> = ({ track }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 📌 Закрытие popup при клике вне области
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(track.name);

  const socialLinks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      icon: <Facebook className="w-5 h-5 text-blue-600" />,
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      icon: <Twitter className="w-5 h-5 text-sky-500" />,
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${url}&text=${text}`,
      icon: <Send className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Email",
      href: `mailto:?subject=${text}&body=${url}`,
      icon: <Mail className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div className="relative select-none" ref={menuRef}>
      {/* Share Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all
          bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
          text-gray-800 dark:text-gray-100 hover:scale-105`}
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full mt-2 right-0 w-48 overflow-hidden rounded-xl backdrop-blur-md shadow-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 transform transition-all duration-300 origin-top-right
          ${open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
      >
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)} // 🧹 Закрываем меню после клика
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {social.icon}
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
};
