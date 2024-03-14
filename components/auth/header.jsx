import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const Header = ({ label }) => {
  return (
    <div className="w-full flex flex-col gap-1 items-center justify-center">
      <h1
        className={cn(
          "text-2xl font-semibold flex tracking-wide",
          font.className,
        )}
      >
        <Image alt="logo" src={"/icon.ico"} width={30} height={0} />
        <span className="hidden sm:block">uessify</span>
      </h1>
      <p className="text-muted-foreground text-md">{label}</p>
    </div>
  );
};
