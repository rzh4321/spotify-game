"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useWindowScroll } from "react-use";
import ProfileDropdown from "./ProfileDropdown";
import { HomeIcon } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function NavBar() {
  const { y: pageYOffset } = useWindowScroll(); // to determine if navbar is sticky
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(pageYOffset > 0);
    onScroll(); // Call on mount for initial check
  }, [pageYOffset]); // Only re-run the effect if pageYOffset changes

  return (
    <div
      className={`self-end flex justify-between w-full items-center px-5 py-9 h-3 sticky top-0 z-50 transition-all duration-300 bg-navbar-bg ${
        scrolled ? "shadow-md border-b border-gray-600" : null
      }`}
    >
      <Link
        href="/home"
        className="cursor-pointer flex items-end tracking-wider text-xl"
      >
        <Image alt="logo" src={"/icon.ico"} width={30} height={0} />
        <span className="hidden sm:block">uessify</span>
      </Link>
      <div className="flex gap-3">
        <Button variant={"blue"} asChild>
          <Link href={"/categories"}>All Categories</Link>
        </Button>
        <ProfileDropdown />
      </div>
    </div>
  );
}
