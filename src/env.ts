export const config = {
    API_URL: process.env.NODE_ENV === "development" ? "http://127.0.0.1:3001" : process.env.API_URL as string,
}