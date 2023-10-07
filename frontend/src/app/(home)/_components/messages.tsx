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
        <div className="relative flex h-72 w-full flex-col rounded-3xl bg-neutral-800 shadow-[0_25px_175px_-12px] shadow-red-900/90 sm:min-w-[360px] lg:w-4/5">
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
        <div className="flex h-24 items-start gap-2 sm:gap-4 bg-neutral-800 px-4 py-4 sm:px-8">
            <div className="relative h-8 max-h-8 min-h-[52px] w-8 min-w-[52px] max-w-[52px] overflow-hidden rounded-full">
                <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className="rounded-full object-cover"
                />
            </div>
            <div className="flex h-fit w-full flex-col items-start gap-1">
                <div className="flex items-start gap-2">
                    <p className="font-cal text-base tracking-wide">
                        {username}
                    </p>
                    <p className="whitespace-nowrap text-sm text-muted-foreground">
                        {time}
                    </p>
                </div>
                <p className="text-lg tracking-tight">{message}</p>
            </div>
        </div>
    );
}
