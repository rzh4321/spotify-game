"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks: { [key: string]: string } = {
  "/profile/account": "Account",
};

export default function SideBar() {
  return (
    <aside>
      <nav className="flex flex-col flex-wrap pr-2 md:sticky md:top-20">
        <div className="pl-2 text-3xl md:w-auto font-medium">Profile</div>
        <SideBarList />
      </nav>
    </aside>
  );
}

function SideBarList() {
  const [activeNavLink, setActiveNavLink] = useState("/");
  const pathname = usePathname();

  // set activeNavLink from pathname
  useEffect(() => {
    setActiveNavLink(pathname);
  }, [pathname]);

  return (
    // loop over link objects, pass active url as a prop
    <ul className="flex flex-row mb-5 md:flex-col">
      {Object.keys(navLinks).map((link) => (
        <SideBarLink key={link} link={link} activeNavLink={activeNavLink} />
      ))}
    </ul>
  );
}

function SideBarLink({
  link,
  activeNavLink,
}: {
  link: string;
  activeNavLink: string;
}) {
  return (
    // display the link, change its color if active
    <li
      key={link}
      className={`rounded px-2 py-1 hover:text-black 
        ${activeNavLink === link ? "bg-gray-100 dark:bg-neutral-800" : ""}`}
    >
      <Link
        href={link}
        className={`font-medium hover:text-black dark:hover:text-gray-200
          ${
            activeNavLink === link
              ? "dark:text-gray-200 text-black"
              : "dark:text-neutral-400 text-neutral-500"
          }`}
      >
        {navLinks[link]}
      </Link>
    </li>
  );
}
