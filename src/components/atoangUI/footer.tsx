import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Overview",
    href: "#",
  },
  {
    title: "Features",
    href: "#",
  },
  {
    title: "Pricing",
    href: "#",
  },
  {
    title: "Careers",
    href: "#",
  },
  {
    title: "Help",
    href: "#",
  },
  {
    title: "Privacy",
    href: "#",
  },
];
import Image from "next/image"
const Footer04Page = () => {
  return (
      <footer className="border-t px-20 text-foreground bg-chart-3 ">
        <div className="max-w-(--breakpoint-xl) mx-auto text-white">
          <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
            <div>
              {/* Logo */}
              <div className="gap-3 flex flex-row items-center">
              <Image src="/esumbong.png"
                alt="esumbong logo"
                width={50}
                height={50}
              />
              <p className="text-2xl font-bold text-white">e-Sumbong</p>
              </div>

              <ul className="mt-4 flex items-center gap-4 flex-wrap">
                {footerLinks.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      href={href}
                      className=" hover:text-foreground"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Newsletter */}
            <div className="max-w-xs w-full">
              <h6 className="font-medium">Stay up to date</h6>
              <form className="mt-6 flex items-center gap-2">
                <Input type="email" placeholder="Enter your email" className="placeholder:text-white border-white"/>
                <Button className="text-black bg-accent">Subscribe</Button>
              </form>
            </div>
          </div>
          <Separator className="bg-white"/>
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                Shadcn UI Blocks
              </Link>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5">
              <Link href="#" target="_blank">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer04Page;
