import { z } from "zod";
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
    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    HOME_PATH: z.string().min(1),
});
type EnvSchema = z.infer<typeof schema>;

export const env: EnvSchema = schema.parse({
    API_URL: process.env.API_URL!,
    AWS_ACCESS_KEY_ID: process.env.API_URL!,
    AWS_REGION: process.env.API_URL!,
    AWS_SECRET_ACCESS_KEY: process.env.API_URL!,
    COOKIE_DOMAIN: process.env.API_URL!,
    DATABASE_URL: process.env.API_URL!,
    DISCORD_ID: process.env.API_URL!,
    DISCORD_SECRET: process.env.API_URL!,
    FRONTEND_URL: process.env.API_URL!,
    HOME_PATH: process.env.API_URL!,
    NEXT_PUBLIC_API_URL: process.env.API_URL!,
    TWITCH_ID: process.env.API_URL!,
    TWITCH_SECRET: process.env.API_URL!,
});
