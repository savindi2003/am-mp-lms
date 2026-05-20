"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="hero" className="bg-yellow-400 scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-7xl sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="order-1 md:order-1 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/primary/milan-pitagaldeniya.png"
                alt="Hero section"
                width={250}
                height={300}
                priority
                className="w-full max-w-xs lg:max-w-md xl:max-w-lg h-auto"
                sizes="(min-width:1280px) 600px, (min-width:1024px) 500px, (min-width:640px) 360px, 240px"
              />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-2 md:order-2 text-center md:text-left mb-5"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-2xl sm:text-4xl lg:text-7xl font-bold text-slate-800 leading-tight"
            >
              Discover, Learn, and Master Science with Milan
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mt-4 text-slate-700 text-sm sm:text-lg max-w-xl"
            >
              Interactive science lessons, revision classes, and paper discussions
              designed to help students achieve A Grade success.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}