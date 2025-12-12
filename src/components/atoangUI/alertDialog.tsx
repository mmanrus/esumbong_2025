import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon, OctagonAlert } from "lucide-react";
import React from "react";
import { IconType } from "react-icons";

interface AlertDialogProps {
  trigger: React.ReactNode;
  Icon: LucideIcon | IconType;
  message: string;
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
            <div className={`mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-${IconColor}/10`}>
              <Icon className={`h-6 w-6 text-${IconColor}`} />
            </div>
            {headMessage}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            {children ? children : message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
