"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
type StatItem = {
  value: string;
  description: string;
  delay: number;
};
type DataPoint = {
  id: number;
  left: number;
  top: number;
  height: number;
  direction: "up" | "down";
  delay: number;
};
const stats: StatItem[] = [
  {
    value: "1B+",
    description: "Messages analyzed\ndaily",
    delay: 0,
  },
  {
    value: "99.9%",
    description: "Accuracy in tone\ndetection",
    delay: 0.2,
  },
  {
    value: "50+",
    description: "Languages supported\nworldwide",
    delay: 0.4,
  },
  {
    value: "1000+",
    description: "Organizations using\nAuralink",
    delay: 0.6,
  },
];
const generateDataPoints = (): DataPoint[] => {
  const points: DataPoint[] = [];
  const baseLeft = 1;
  const spacing = 32;
  for (let i = 0; i < 50; i++) {
    const direction = i % 2 === 0 ? "down" : "up";
    const height = Math.floor(Math.random() * 120) + 88;
    const top =
      direction === "down"
        ? Math.random() * 150 + 250
        : Math.random() * 100 - 80;
    points.push({
      id: i,
      left: baseLeft + i * spacing,
      top,
      height,
      direction,
      delay: i * 0.035,
    });
  }
  return points;
};

// @component: BankingScaleHero
export const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dataPoints] = useState<DataPoint[]>(generateDataPoints());
  const [typingComplete, setTypingComplete] = useState(false);
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setTypingComplete(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // @return
  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-8 py-24 pt-16">
        <div className="grid grid-cols-12 gap-5 gap-y-16">
          <div className="relative z-10 col-span-12 md:col-span-6">
            <div
              className="relative mb-12 inline-flex h-6 items-center px-2 font-mono text-xs text-[#167E6C] uppercase"
              style={{
                fontFamily:
                  "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
              }}
            >
              <div className="flex items-center gap-0.5 overflow-hidden">
                <motion.span
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "auto",
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="relative z-10 block overflow-hidden whitespace-nowrap text-[#167E6C]"
                  style={{
                    color: "#146e96",
                  }}
                >
                  Trusted at scale
                </motion.span>
                <motion.span
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: typingComplete ? [1, 0, 1, 0] : 0,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="relative z-10 ml-0.5 block h-3 w-1.5 rounded-sm bg-[#167E6C]"
                  style={{
                    color: "#146e96",
                  }}
                />
              </div>
            </div>

            <h2
              className="mb-6 text-[40px] leading-tight font-normal tracking-tight text-[#111A4A]"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontSize: "40px",
                fontWeight: "400",
              }}
            >
              Transforming how millions read and understand PDFs.{" "}
            </h2>

            <p
              className="mt-0 mb-6 text-lg leading-6 text-[#111A4A] opacity-60"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              For students, researchers, and teams who want faster learning,
              clearer notes, and instant AI-powered summaries—all inside one
              powerful workspace.
            </p>

            <button className="group relative mt-5 inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-white/50 px-4 text-center text-sm leading-4 font-medium whitespace-nowrap text-[#232730] shadow-[0_1px_1px_0_rgba(255,255,255,0),0_0_0_1px_rgba(87,90,100,0.12)] backdrop-blur-sm transition-all duration-200 ease-in-out outline-none hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_0_0_1px_rgba(87,90,100,0.18)]">
              <span className="relative z-10 flex items-center gap-1">
                Learn about our platform
                <ArrowRight className="-mr-1 h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="relative -ml-[200px] h-[416px] w-full">
              <div className="pointer-events-none absolute top-0 left-[302px] h-[416px] w-[680px]">
                <div className="relative h-full w-full">
                  {dataPoints.map((point) => (
                    <motion.div
                      key={point.id}
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={
                        isVisible
                          ? {
                              opacity: [0, 1, 1],
                              height: [0, point.height, point.height],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        delay: point.delay,
                        ease: [0.5, 0, 0.01, 1],
                      }}
                      className="absolute w-1.5 rounded-[3px]"
                      style={{
                        left: `${point.left}px`,
                        top: `${point.top}px`,
                        background:
                          point.direction === "down"
                            ? "linear-gradient(rgb(176, 200, 196) 0%, rgb(176, 200, 196) 10%, rgba(156, 217, 93, 0.1) 40%, rgba(113, 210, 240, 0) 75%)"
                            : "linear-gradient(to top, rgb(176, 200, 196) 0%, rgb(176, 200, 196) 10%, rgba(156, 217, 93, 0.1) 40%, rgba(113, 210, 240, 0) 75%)",
                        backgroundColor: "rgba(22, 126, 108, 0.01)",
                      }}
                    >
                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        animate={
                          isVisible
                            ? {
                                opacity: [0, 1],
                              }
                            : {}
                        }
                        transition={{
                          duration: 0.3,
                          delay: point.delay + 1.7,
                        }}
                        className="absolute -left-[1px] h-2 w-2 rounded-full bg-[#167E6C]"
                        style={{
                          top:
                            point.direction === "down"
                              ? "0px"
                              : `${point.height - 8}px`,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="col-span-12">
            <div className="overflow-visible pb-5">
              <div className="relative z-10 grid grid-cols-12 gap-5">
                {stats.map((stat, index) => (
                  <div key={index} className="col-span-6 md:col-span-3">
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                        filter: "blur(4px)",
                      }}
                      animate={
                        isVisible
                          ? {
                              opacity: [0, 1, 1],
                              y: [20, 0, 0],
                              filter: ["blur(4px)", "blur(0px)", "blur(0px)"],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.5,
                        delay: stat.delay,
                        ease: [0.1, 0, 0.1, 1],
                      }}
                      className="flex flex-col gap-2"
                    >
                      <span
                        className="text-2xl leading-[26.4px] font-medium tracking-tight text-[#167E6C]"
                        style={{
                          color: "#146e96",
                        }}
                      >
                        {stat.value}
                      </span>
                      <p className="m-0 text-xs leading-[13.2px] whitespace-pre-line text-[#7C7F88]">
                        {stat.description}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
