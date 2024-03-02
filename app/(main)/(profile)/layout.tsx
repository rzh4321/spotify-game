import SideBar from "@/components/Sidebar";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-4xl flex flex-col 
    md:flex-row md:gap-10
    ">
        <SideBar />
        {children}
    </div>
  );
}
