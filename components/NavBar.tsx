"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useWindowScroll } from "react-use";
import ProfileDropdown from "./ProfileDropdown";
import { HomeIcon, Users } from "lucide-react";

export default function NavBar() {
  const { y: pageYOffset } = useWindowScroll(); // to determine if navbar is sticky
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(pageYOffset > 0);
    onScroll(); // Call on mount for initial check
  }, [pageYOffset]); // Only re-run the effect if pageYOffset changes

  return (
    <div
      className={`self-end flex justify-between w-full items-center mb-16 py-8 px-5 h-3 sticky top-0 z-50 transition-all duration-300 bg-inherit ${
        scrolled ? "shadow-md border-b border-gray-600" : null
      }`}
    >
      <Link href="/home" className="cursor-pointer">
        <HomeIcon />
      </Link>
      <ProfileDropdown />
    </div>
  );
}
