export const config = {
    API_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "https://api.valbuddy.com",
}