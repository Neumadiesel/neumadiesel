import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const isAuthenticated = !!token;
    const isPublicPath = request.nextUrl.pathname === "/" || 
                        request.nextUrl.pathname === "/login" ||
                        request.nextUrl.pathname.startsWith("/_next") ||
                        request.nextUrl.pathname.startsWith("/api") ||
                        request.nextUrl.pathname.includes(".");

    // Permitir acceso a rutas públicas y archivos estáticos
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Redirigir al login si no está autenticado
    if (!isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configurar las rutas que deben ser protegidas
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}; 