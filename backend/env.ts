import { z } from "zod";
import { config } from 'dotenv';
config({
    path: ".env"
});
const schema = z.object({
    DISCORD_ID: z.string().min(1),
    DISCORD_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    API_URL: z.string().min(1),
    FRONTEND_URL: z.string().min(1),
    COOKIE_DOMAIN: z.string().min(1),
    TWITCH_ID: z.string().min(1),
    TWITCH_SECRET: z.string().min(1),
    NEXT_PUBLIC_API_URL: z.string().min(1),
    AWS_DEFAULT_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    HOME_PATH: z.string().min(1),
});
type EnvSchema = z.infer<typeof schema>;

export const env: EnvSchema = schema.parse({
    API_URL: process.env.API_URL!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN!,
    DATABASE_URL: process.env.DATABASE_URL!,
    DISCORD_ID: process.env.DISCORD_ID!,
    DISCORD_SECRET: process.env.DISCORD_SECRET!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    HOME_PATH: process.env.HOME_PATH!,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
    TWITCH_ID: process.env.TWITCH_ID!,
    TWITCH_SECRET: process.env.TWITCH_SECRET!,
});
