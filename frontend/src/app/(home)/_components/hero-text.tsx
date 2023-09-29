"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
export default function HeroText() {
    const words = ["MAKE FRIENDS", "CREATE TEAMS", "JOIN EVENTS"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 2500);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, [words.length]);
    return (
        <AnimatePresence mode="wait">
            <motion.h2
                key={words[index].split(" ")[0]}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col text-[16vw] sm:text-8xl"
            >
                <span className="text-primary">
                    {words[index].split(" ")[0]}
                </span>
            </motion.h2>
            <motion.h2
                key={words[index].split(" ")[1]}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex flex-col text-[16vw] sm:text-8xl"
            >
                {words[index].split(" ")[1]}
            </motion.h2>
        </AnimatePresence>
    );
}
