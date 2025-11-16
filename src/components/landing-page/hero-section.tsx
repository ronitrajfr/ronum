"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
type ProductTeaserCardProps = {
  dailyVolume?: string;
  dailyVolumeLabel?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  videoSrc?: string;
  posterSrc?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
};

export const HeroSection = (props: ProductTeaserCardProps) => {
  const {
    headline = "Enhance your reading experience with Ronum",
    subheadline = "Upload your PDFs, get instant AI summaries, make notes, and actually understand what you’re reading. Everything you need to learn faster, all in one place.",
    primaryButtonText = "Get Started",
    secondaryButtonText = "View Code",
    secondaryButtonHref = "https://github.com/ronitrajfr/ronum",
  } = props;

  const router = useRouter();
  const { data, status } = useSession();

  async function handleClick() {
    if (status === "unauthenticated") {
      await signIn("google", { callbackUrl: "/dashboard" });
    } else {
      router.push("/dashboard");
    }
  }

  // @return
  return (
    <section className="w-full px-8 pt-32 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-2">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.645, 0.045, 0.355, 1],
            }}
            className="col-span-12 flex aspect-square flex-col justify-end overflow-hidden rounded-[40px] bg-[#e9e9e9] p-12 lg:col-span-6 lg:p-16"
          >
            <h1
              className="mb-6 max-w-[520px] text-[56px] leading-[60px] tracking-tight text-[#202020]"
              style={{
                fontWeight: "500",
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              {headline}
            </h1>

            <p
              className="mb-6 max-w-[520px] text-lg leading-7 text-[#404040]"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              {subheadline}
            </p>

            <ul className="mt-10 flex flex-wrap gap-1.5">
              <li>
                <a
                  onClick={(e) => handleClick()}
                  className="block cursor-pointer rounded-full bg-[#0988f0] px-[18px] py-[15px] text-base leading-4 whitespace-nowrap text-white transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl"
                  style={{
                    background: "#156d95",
                  }}
                >
                  {primaryButtonText}
                </a>
              </li>
              <li>
                <a
                  href={secondaryButtonHref}
                  className="block cursor-pointer rounded-full border border-[#202020] px-[18px] py-[15px] text-base leading-4 whitespace-nowrap text-[#202020] transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl"
                >
                  {secondaryButtonText}
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.645, 0.045, 0.355, 1],
              delay: 0.2,
            }}
            className="col-span-12 flex aspect-square items-center justify-center overflow-hidden rounded-[40px] bg-white lg:col-span-6"
            style={{
              backgroundImage:
                "url(https://storage.googleapis.com/storage.magicpath.ai/user/282171029206482944/assets/882ef3dd-3459-4fd8-a939-52ceada51d5c.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: "1",
            }}
          ></motion.div>
        </div>
      </div>
    </section>
  );
};
