/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
	async rewrites() {
        if(process.env.NODE_ENV === "development"){
            return [
                {
                    source: "/api/:path*",
                    destination: "http://127.0.0.1:3001/:path*",
                },
            ];
        } else {
            return []
        }
	},
};

export default nextConfig;
