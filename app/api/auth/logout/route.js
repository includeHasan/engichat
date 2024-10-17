export async function GET(req) {
    const headers = new Headers();
    headers.append('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=86400'); // Set cookie

    return new Response(
        JSON.stringify({ message: 'Logged out' }),
        { status: 200, headers } // Add headers here
    );
}
