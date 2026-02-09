import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LucideIcon } from "lucide-react";
import React from "react";
import { IconType } from "react-icons";

interface AlertDialogProps {
  trigger: React.ReactNode;
  Icon: LucideIcon | IconType;
  message?: string;
  headMessage: string;
  IconColor?: "destructive" | "success" | "accent" | "info" | string;
  children?: React.ReactNode;
}
export default function DialogAlert({
  trigger,
  message,
  headMessage,
  Icon,
  IconColor,
  children,
}: AlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div
              className={`mx-auto sm:mx-0 mb-4 flex flex-row gap-3 items-center justify-center rounded-full bg-${IconColor}/10`}
            >
              <Icon className={`h-6 w-6 text-${IconColor}`} />

              <span>{headMessage}</span>
            </div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center sm:justify-center items-center">

          {children ? children : message}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
