import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="bg-destructive p-3 rounded-md flex items-center gap-x-2 text-md">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
