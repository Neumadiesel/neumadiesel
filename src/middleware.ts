import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const { pathname } = request.nextUrl;

    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    // Permitir acceso a archivos estáticos y multimedia
    const isStaticFile = pathname.startsWith('/_next') || 
                        pathname.startsWith('/api') || 
                        pathname.startsWith('/public') ||
                        pathname.includes('.') || // Para archivos con extensiones
                        pathname.endsWith('/favicon.ico');

    // Si es un archivo estático o multimedia, permitir el acceso
    if (isStaticFile) {
        return NextResponse.next();
    }

    // Si es una ruta pública, permitir el acceso
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Si no hay token y no es una ruta pública, redirigir al login
    if (!token && !isPublicPath) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Si hay token y es la ruta de login, redirigir al dashboard
    if (token && pathname === '/login') {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
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