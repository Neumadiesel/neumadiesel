import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/forgot-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Verificar si la ruta es pública
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Permitir acceso a archivos estáticos y multimedia
    if (
        pathname.startsWith('/_next') || // Archivos de Next.js
        pathname.startsWith('/api') || // Rutas de API
        pathname.startsWith('/static') || // Archivos estáticos
        pathname.includes('.') || // Archivos con extensión (imágenes, videos, etc.)
        pathname === '/favicon.ico' // Favicon
    ) {
        return NextResponse.next();
    }

    // Verificar si hay un token en las cookies
    const token = request.cookies.get('auth-token')?.value;

    // Si no hay token y no es una ruta pública, redirigir al login
    if (!token && !publicRoutes.includes(pathname)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
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