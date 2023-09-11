/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    images: {
        domains: ["cdn.discordapp.com", "static-cdn.jtvnw.net", "img.valbuddy.com"]
    },
    async rewrites() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/api/:path*",
                    destination: "http://127.0.0.1:3001/:path*",
                },
            ];
        } else {
            return [];
        }
    },
};

export default nextConfig;
