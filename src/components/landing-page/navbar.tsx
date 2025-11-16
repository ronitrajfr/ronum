"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export const Navbar = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const handleLinkClick = (href: string) => {};

  async function handleClick() {
    if (status === "unauthenticated") {
      await signIn("google", { callbackUrl: "/dashboard" });
    } else {
      router.push("/dashboard");
    }
  }

  // @return
  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 shadow-sm backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <button
              onClick={() => handleLinkClick("#home")}
              className="text-foreground hover:text-primary text-2xl font-bold transition-colors duration-200"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              <span
                style={{
                  fontFamily: "Figtree",
                  fontWeight: "800",
                }}
              >
                Ronum
              </span>
            </button>
          </div>

          <div className="hidden md:block">
            <button
              onClick={() => handleClick()}
              className="cursor-pointer rounded-full bg-[#156d95] px-[18px] py-[15px] text-base leading-4 font-semibold whitespace-nowrap text-white shadow-sm transition-all duration-200 hover:rounded-2xl hover:bg-[#156d95]/90 hover:shadow-md"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              <span
                style={{
                  fontFamily: "Figtree",
                  fontWeight: "500",
                }}
              >
                Get Started
              </span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-foreground hover:text-primary rounded-md p-2 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="bg-background/95 border-border border-t backdrop-blur-md md:hidden"
          >
            <div className="space-y-4 px-6 py-6">
              <div className="border-border border-t pt-4">
                <button
                  onClick={() => handleClick()}
                  className="w-full cursor-pointer rounded-full bg-[#156d95] px-[18px] py-[15px] text-base font-semibold text-white transition-all duration-200 hover:bg-[#156d95]/90"
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  <span>Get Started</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
