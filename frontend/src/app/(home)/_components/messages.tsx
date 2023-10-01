"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
const users = [
    {
        username: "JettPlayer256",
        image: "/files/jett-portrait.jpg",
        imageAlt: "Jett Image",
        time: "Today at 6:48PM",
        message: "Hey! Looking for duo gold 3! Join channel 2"
    },
    {
        username: "PheonixUlt888",
        image: "/files/pheonix-portrait.jpg",
        imageAlt: "Pheonix Image",
        time: "Today at 6:48PM",
        message: "lfg gold"
    },
    {
        username: "YoruMain147",
        image: "/files/yoru-portrait.jpg",
        imageAlt: "Yoru Image",
        time: "Today at 6:48PM",
        message: "anyone quick play?"
    },
    {
        username: "JettPlayer256",
        image: "/files/jett-portrait.jpg",
        imageAlt: "Jett Image",
        time: "Today at 6:48PM",
        message: "Hey! Looking for duo gold 3! Join channel 2"
    },
    {
        username: "PheonixUlt888",
        image: "/files/pheonix-portrait.jpg",
        imageAlt: "Pheonix Image",
        time: "Today at 6:48PM",
        message: "lfg gold"
    },
    {
        username: "YoruMain147",
        image: "/files/yoru-portrait.jpg",
        imageAlt: "Yoru Image",
        time: "Today at 6:48PM",
        message: "anyone quick play?"
    }
];

export default function Messages() {
    return (
        <div className="relative flex h-72 w-full flex-col rounded-3xl bg-neutral-800 shadow-[0_25px_175px_-12px] shadow-red-900/90 sm:min-w-[360px] lg:w-3/4">
            <X
                width={36}
                height={36}
                stroke="black"
                strokeWidth={3}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-primary p-1"
            />
            <div className="flex-grow overflow-hidden rounded-3xl">
                {users.map((user, index) => {
                    return (
                        <motion.div
                            key={index}
                            animate={{
                                y: [96, 0, -96, -192]
                            }}
                            transition={{
                                duration: 5,
                                ease: [0, 1, 0, 1],
                                times: [0, 0.2, 0.4, 0.6, 1],
                                repeat: Infinity
                            }}
                        >
                            <DiscordMessage
                                image={user.image}
                                imageAlt={user.imageAlt}
                                message={user.message}
                                time={user.time}
                                username={user.username}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

function DiscordMessage({
    image,
    imageAlt,
    username,
    message,
    time
}: {
    image: string;
    imageAlt: string;
    username?: string;
    message?: string;
    time?: string;
}) {
    return (
        <div className="flex h-24 items-start gap-4 bg-neutral-800 px-4 py-4 sm:px-8">
            <Image
                src={image}
                alt={imageAlt}
                height={52}
                width={52}
                className="rounded-full"
            />
            <div className="items- flex h-fit w-full flex-col gap-1">
                <div className="flex items-center gap-4">
                    <p className="text-sm">{username}</p>
                    <p className="text-xs text-muted-foreground">{time}</p>
                </div>
                <p className="text-base leading-tight">{message}</p>
            </div>
        </div>
    );
}
