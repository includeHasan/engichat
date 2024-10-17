import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token');
    // Check if the token exists and has a non-empty value
    if (token && token.value) {
        const url = request.nextUrl.clone();
        url.pathname = '/chat';
        return NextResponse.redirect(url);
    }

    // Continue to the original request if no valid token is present
    return NextResponse.next();
}

// Specify the paths to apply the middleware
export const config = {
    matcher: ['/'],
};
