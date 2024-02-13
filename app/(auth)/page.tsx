import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
export default function Login() {
  return (
    <div className="flex justify-center items-center w-full h-screen px-44 xl:px-80">
      <LoginForm />
    </div>
  );
}
