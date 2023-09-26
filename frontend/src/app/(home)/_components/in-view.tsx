"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";

export default function InView({
    children,
    index = 0,
    key
}: {
    children?: React.ReactNode;
    index?: number;
    key?: string;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };
    return (
        <AnimatePresence>
            <motion.div
                animate={isInView ? "visible" : "hidden"}
                transition={{
                    duration: isInView ? 0.5 : 0,
                    ease: "easeOut",
                    delay: isInView ? index * 0.075 : 0
                }}
                variants={variants}
                ref={ref}
                key={key}
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
