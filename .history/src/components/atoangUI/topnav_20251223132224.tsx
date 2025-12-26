"use client";

import * as React from "react";
import Link from "next/link";
import {cn} from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];
import Image  from 'next/image'
export default function NavigationMenuDemo() {
  return (
    <div className="w-full bg-[#1F4251] h-20 flex items-center px-20 justify-between">
      <div className="flex items-center flex-col bg-transparent">
      <Image src="/esumbong.png"
        alt="Esumbon logo"
        width={50}
        height={100}
        priority
      />
      <span className="font-bold">e-Sumbong</span>
      </div>
      <NavigationMenu viewport={false}>

        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
            >
              <Link href="/landingPage" className="dark:text-white text-white">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
            <Link href="/landingPage/about-us" className="dark:text-white text-white">About Us</Link>
          </NavigationMenuLink>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
            >
              <Link href="/landingPage/features" className="dark:text-white text-white">Features</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), "bg-[#FFD740] rounded-none")}
            >
              <Link href="/landingPage/auth?form=login" >Login</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), "bg-[#1F4251] border border-white rounded-none")} >
              <Link href="/landingPage/auth?form=sign-up" className="dark:text-white text-white">Register</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
