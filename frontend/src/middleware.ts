import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config as env } from './env';
export const config = {
    // Protected Routes
    matcher: [
        "/profile",
        "/settings"
    ],
};

export function middleware(request: NextRequest) {
    if (!request.cookies.has("session_id")) {
        return NextResponse.redirect(`${env.FRONTEND_URL}/login`);
    }
}