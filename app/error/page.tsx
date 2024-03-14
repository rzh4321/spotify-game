"use client";
import { useSearchParams } from "next/navigation";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Error() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  // if (!error) router.back();
  let displayMsg;
  if (error === "Username does not exist") {
    displayMsg = "Try clearing cookies for this site";
  } else {
    displayMsg = `An unexpected error occurred: ${error}`;
  }
  return (
    <div className="bg-inherit w-full flex flex-col">
      <div
        className={`self-end flex justify-between w-full items-center px-5 py-9 h-3 sticky top-0 z-50 transition-all duration-300 bg-navbar-bg shadow-md
        `}
      >
        <div
          className="cursor-pointer flex items-end tracking-wider text-xl"
          onClick={() => router.back()}
        >
          <Image alt="logo" src={"/icon.ico"} width={30} height={0} />
          <span className="hidden sm:block">uessify</span>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4 items-center justify-center">
        <h2 className="font-semibold text-2xl">Something went wrong!</h2>
        <span className="text-muted-foreground">{displayMsg}</span>
        <Button className="p-2" variant={"blue"} onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
