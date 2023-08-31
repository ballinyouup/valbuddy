export const config = {
    API_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : process.env.NEXT_PUBLIC_API_URL as string,
    FRONTEND_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.FRONTEND_URL as string,
};