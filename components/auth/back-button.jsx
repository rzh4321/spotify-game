"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export const BackButton = ({ href, label }) => {
  return (
    <Button variant="link" className="font-normal w-full underline" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
