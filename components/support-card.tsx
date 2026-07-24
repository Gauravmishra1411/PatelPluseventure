"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const SupportCard = () => {
  return (
    <div className="flex items-center justify-center px-8 py-24 text-neutral-800 dark:text-neutral-200">
      <BlockInTextCard
        tag="/ Support"
        text={
          <>
            <strong>Have questions?</strong> We&apos;d love to help! Contact support
            for any issue you may face.
          </>
        }
        examples={[
          "How do I apply for a Government Tender?",
          "Can you help with documentation for a Private Tender?",
          "What is the timeline for tender evaluation?",
          "How do I contact the procurement officer?",
        ]}
      />
    </div>
  );
};

const BlockInTextCard = ({ tag, text, examples }: { tag: string, text: React.ReactNode, examples: string[] }) => {
  return (
    <div className="w-full max-w-xl space-y-6">
      <div>
        <p className="mb-1.5 text-sm font-light uppercase text-gray-500 dark:text-gray-400">{tag}</p>
        <hr className="border-neutral-300 dark:border-neutral-700" />
      </div>
      <p className="max-w-lg text-xl leading-relaxed text-gray-800 dark:text-gray-200">{text}</p>
      <div>
        <Typewrite examples={examples} />
        <hr className="border-neutral-300 dark:border-neutral-700" />
      </div>
      <a href="/contact" className="block text-center w-full rounded-full border border-neutral-950 dark:border-neutral-200 py-3 text-sm font-medium transition-colors hover:bg-neutral-950 hover:text-neutral-100 dark:hover:bg-neutral-200 dark:hover:text-neutral-900">
        Contact Support
      </a>
    </div>
  );
};

const LETTER_DELAY = 0.025;
const BOX_FADE_DURATION = 0.125;

const FADE_DELAY = 5;
const MAIN_FADE_DURATION = 0.25;

const SWAP_DELAY_IN_MS = 5500;

const Typewrite = ({ examples }: { examples: string[] }) => {
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setExampleIndex((pv) => (pv + 1) % examples.length);
    }, SWAP_DELAY_IN_MS);

    return () => clearInterval(intervalId);
  }, [examples.length]);

  return (
    <p className="mb-2.5 text-sm font-light uppercase text-gray-500 dark:text-gray-400">
      <span className="inline-block size-2 bg-neutral-950 dark:bg-neutral-200" />
      <span className="ml-3">
        EXAMPLE:{" "}
        {examples[exampleIndex].split("").map((l, i) => (
          <motion.span
            initial={{
              opacity: 1,
            }}
            animate={{
              opacity: 0,
            }}
            transition={{
              delay: FADE_DELAY,
              duration: MAIN_FADE_DURATION,
              ease: "easeInOut",
            }}
            key={`${exampleIndex}-${i}`}
            className="relative text-gray-800 dark:text-gray-200"
          >
            <motion.span
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: i * LETTER_DELAY,
                duration: 0,
              }}
            >
              {l}
            </motion.span>
            <motion.span
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                delay: i * LETTER_DELAY,
                times: [0, 0.1, 1],
                duration: BOX_FADE_DURATION,
                ease: "easeInOut",
              }}
              className="absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-neutral-950 dark:bg-neutral-200"
            />
          </motion.span>
        ))}
      </span>
    </p>
  );
};
