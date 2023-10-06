"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
export default function HeroText() {
    const words = ["MAKE FRIENDS", "CREATE TEAMS", "JOIN EVENTS"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 3000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, [words.length]);
    return (
        <AnimatePresence mode="wait">
            <div
                key={words[index]}
                className="flex flex-col text-[16vw] sm:text-8xl"
            >
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{
                        delay: 0,
                        duration: 0.5
                    }}
                    className="text-primary"
                >
                    {words[index].split(" ")[0]}
                </motion.h1>
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{
                        delay: 0.15,
                        duration: 0.45
                    }}
                >
                    {words[index].split(" ")[1]}
                </motion.h1>
            </div>
        </AnimatePresence>
    );
}
