import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

type ErrorMessageProps = {
  message: string;
  type: "form" | "link" | "regular";
  link?: string;
};

export default function ErrorMessage({
  message,
  type,
  link,
}: ErrorMessageProps) {
  // Function to create the message with a link
  const createMessageWithLink = (
    message: string,
    linkWord: string | undefined,
  ) => {
    if (!linkWord) return message;

    // Split the message by the linkWord to get the parts before and after
    const parts = message.split(linkWord);

    // If the linkWord is not found, return the original message
    if (parts.length < 2) return message;

    return (
      <>
        {parts[0]}
        <Link href="/profile" className="text-green-600 underline">
          {linkWord}
        </Link>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={`${type === "form" || type === "link" ? "bg-destructive/15 text-red-700" : "bg-destructive"} p-3 rounded-md flex items-center gap-x-2 text-md`}
    >
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{type === "link" ? createMessageWithLink(message, link) : message}</p>
    </div>
  );
}
