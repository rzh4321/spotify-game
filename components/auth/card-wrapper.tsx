"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
// import { BackButton } from "@/components/auth/back-button";

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}) => {
  return (
    <Card className="lg:w-[500px] min-w-[300px] border-none">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {children}
      </CardContent>
      {/* <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter> */}
    </Card>
  );
};
