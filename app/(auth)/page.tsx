import { LoginForm } from "@/components/auth/login-form";
import { cookies } from "next/headers";
import Background from "@/components/background";

export default function Login() {
  const cookieStore = cookies();

  const username = cookieStore.get("visitor")?.value;
  return (
    <div className="flex justify-center items-center w-full h-screen px-44 xl:px-80">
      <Background />
      <LoginForm visitorUsername={username} />
    </div>
  );
}
