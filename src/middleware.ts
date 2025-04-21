import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Definir las rutas y los roles permitidos
const routePermissions = {
    // Rutas públicas
    public: ['/login', '/'],
    
    // Rutas accesibles para todos los usuarios autenticados
    authenticated: ['/perfil'],
    
    // Rutas de administración
    administrador: [
        '/administracion/usuarios',
        '/administracion/faena',
        '/administracion/razon-de-retiro',
    ],
    
    // Rutas de reportabilidad
    reportabilidad: [
        '/estadisticas',
    ],
    
    // Rutas de equipos
    equipos: [
        '/maquinaria',
    ],
    
    // Rutas de neumáticos
    neumaticos: [
        '/neumaticos',
        '/neumaticos/bodega',
    ],
    
    // Rutas de mantenimiento
    mantenimiento: [
        '/mantenimiento',
        '/mantenimiento/Historial',
        '/mantenimiento/orden-de-trabajo',
        '/mantenimiento/programar-mantenimiento',
        '/mantenimiento/programas',
    ],
    
    // Rutas de ingreso de datos
    ingresoDatos: [
        '/Ingresar-datos',
        '/Ingresar-datos/medicion-por-equipo',
        '/Ingresar-datos/crear-neumatico',
        '/Ingresar-datos/crear-modelo',
        '/Ingresar-datos/crear-maquinaria',
    ],
};

// Mapeo de roles a rutas permitidas
const rolePermissions = {
    administrador: [
        ...routePermissions.administrador,
        ...routePermissions.reportabilidad,
        ...routePermissions.equipos,
        ...routePermissions.neumaticos,
        ...routePermissions.mantenimiento,
        ...routePermissions.ingresoDatos,
    ],
    planificador: [
        ...routePermissions.reportabilidad,
        ...routePermissions.equipos,
        ...routePermissions.neumaticos,
        ...routePermissions.mantenimiento,
        ...routePermissions.ingresoDatos,
    ],
    supervisor: [
        ...routePermissions.reportabilidad,
        ...routePermissions.equipos,
        ...routePermissions.neumaticos,
        ...routePermissions.mantenimiento,
        ...routePermissions.ingresoDatos,
    ],
    operador: [
        '/Ingresar-datos/medicion-por-equipo',
    ],
    stakeholder: [
        ...routePermissions.reportabilidad,
    ],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const userData = request.cookies.get('user-data')?.value;
    const { pathname } = request.nextUrl;

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
    if (routePermissions.public.includes(pathname)) {
        return NextResponse.next();
    }

    // Si no hay token y no es una ruta pública, redirigir al login
    if (!token && !routePermissions.public.includes(pathname)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Si hay token y es la ruta de login, redirigir al dashboard
    if (token && pathname === '/login') {
        const main = new URL('/', request.url);
        return NextResponse.redirect(main);
    }

    // Si es una ruta accesible para todos los usuarios autenticados, permitir el acceso
    if (routePermissions.authenticated.includes(pathname)) {
        return NextResponse.next();
    }

    // Verificar permisos basados en el rol
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const userRole = user.role?.name?.toLowerCase();
            
            if (userRole && rolePermissions[userRole as keyof typeof rolePermissions]) {
                const allowedPaths = rolePermissions[userRole as keyof typeof rolePermissions];
                
                // Verificar si la ruta actual está permitida para el rol
                const isPathAllowed = allowedPaths.some(allowedPath => 
                    pathname.startsWith(allowedPath)
                );

                if (!isPathAllowed) {
                    // Redirigir a una página de acceso denegado o al dashboard
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
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