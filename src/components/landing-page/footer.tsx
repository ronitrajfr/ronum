import Image from "next/image";
import Link from "next/link";
import React from "react";
//import { Logo } from "./logo";

export function Footer() {
  const socials = [
    { title: "Twitter", href: "https://x.com/ronitrajfr" },
    { title: "GitHub", href: "https://github.com/ronitrajfr/ronum" },
  ];

  return (
    <div className="relative w-full overflow-hidden border-t border-neutral-100 bg-white px-8 py-20 dark:border-white/[0.1] dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-neutral-500 sm:flex-row md:px-8">
        <div>
          <div className="mt-2 ml-2 text-neutral-600 dark:text-neutral-400">
            <p>
              &copy; 2025 Ronum. Built by{" "}
              <Link
                href="https://x.com/ronitrajfr"
                target="_blank"
                className="text-sky-600 underline hover:text-sky-800 dark:text-sky-400"
              >
                @ronitrajfr
              </Link>{" "}
            </p>
            <p className="mt-1">
              View the repo on{" "}
              <Link
                href="https://github.com/ronitrajfr/ronum"
                target="_blank"
                className="text-sky-600 underline hover:text-sky-800 dark:text-sky-400"
              >
                GitHub
              </Link>{" "}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 md:mt-0 lg:grid-cols-4">
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-neutral-600 dark:text-neutral-300">
              Socials
            </p>
            <ul className="space-y-4 text-neutral-600 dark:text-neutral-300">
              {socials.map((social, idx) => (
                <li key={"social" + idx}>
                  <Link
                    href={social.href}
                    className="hover:text-neutral-800 dark:hover:text-white"
                    target="_blank"
                  >
                    {social.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="inset-x-0 mt-20 bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-center text-5xl font-bold text-transparent uppercase md:text-9xl lg:text-[12rem] xl:text-[13rem] dark:from-neutral-950 dark:to-neutral-800">
        RONUM
      </p>
    </div>
  );
}
