"use client";
import Image from "next/image";
import { motion } from "framer-motion";
const users = [
    {
        username: "JettPlayer256",
        image: "/jett-portrait.jpg",
        imageAlt: "Jett Image",
        time: "Today at 6:48PM",
        message: "Hey! Looking for duo gold 3! Join channel 2"
    },
    {
        username: "PheonixUlt888",
        image: "/pheonix-portrait.jpg",
        imageAlt: "Pheonix Image",
        time: "Today at 6:48PM",
        message: "lfg gold"
    },
    {
        username: "YoruMain147",
        image: "/yoru-portrait.jpg",
        imageAlt: "Yoru Image",
        time: "Today at 6:48PM",
        message: "anyone quick play?"
    },
    {
        username: "JettPlayer256",
        image: "/jett-portrait.jpg",
        imageAlt: "Jett Image",
        time: "Today at 6:48PM",
        message: "Hey! Looking for duo gold 3! Join channel 2"
    },
    {
        username: "PheonixUlt888",
        image: "/pheonix-portrait.jpg",
        imageAlt: "Pheonix Image",
        time: "Today at 6:48PM",
        message: "lfg gold"
    },
    {
        username: "YoruMain147",
        image: "/yoru-portrait.jpg",
        imageAlt: "Yoru Image",
        time: "Today at 6:48PM",
        message: "anyone quick play?"
    }
];

export default function Messages() {
    return (
        <div className="flex h-72 w-2/3 flex-col overflow-hidden rounded-lg bg-neutral-800 shadow-[0_25px_175px_-12px] shadow-red-900/90">
            {users.map((user, index) => {
                return (
                    <motion.div
                        key={index}
                        animate={{
                            y: [96, 0, -96, -192]
                        }}
                        transition={{
                            duration: 7.5,
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
        <div className="flex h-24 items-start gap-4 bg-neutral-800 px-8 py-4">
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
                <p className="text-lg leading-tight">{message}</p>
            </div>
        </div>
    );
}
