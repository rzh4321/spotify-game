import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function FormError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-md text-red-700">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
