import { RegisterForm } from "@/components/auth/register-form";
import Background from "@/components/background";

export default function Register() {
  return (
    <div className="flex justify-center items-center w-full h-screen px-44 xl:px-80">
      <Background />
      <RegisterForm />
    </div>
  );
}
