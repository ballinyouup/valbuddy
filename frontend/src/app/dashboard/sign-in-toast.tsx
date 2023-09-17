"use client";
import { useMounted } from "@/hooks/use-mounted";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function SignInToast({
  error
}: {
  error: string | string[] | undefined;
}) {
  const { toast } = useToast();
  const mount = useMounted();
  useEffect(() => {
    if (error && typeof error === "string" && mount) {
      toast({
        title: error,
        description: "Please Log in with Another Provider",
        variant: "destructive"
      });
    }
  }, [error, toast, mount]);
  return <></>;
}
