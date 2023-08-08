export const Config = {
    API_URL: process.env.NODE_ENV !== "development" ?  "https://api.valbuddy.com" : "http://localhost:3000"
}