export const config = {
    API_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : process.env.API_URL as string,
}