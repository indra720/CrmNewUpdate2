import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the authorized base path for each role. Access is restricted to these prefixes.
const roleAuthorizedBasePaths: Record<string, string[]> = {
  // Superadmin can only access their own role-specific sections
  superadmin: ['/superadmin'],
  admin: ['/admin'],
  'team-leader': ['/team-leader'],
  staff: ['/staff'],
};

// Define the default dashboard URL for each role. This is where users are sent upon login
// or when accessing a page they are not authorized to see.
const defaultDashboardForRole: Record<string, string> = {
  superadmin: '/superadmin/dashboard',
  admin: '/admin/users/team-leader',
  'team-leader': '/team-leader',
  staff: '/staff/dashboard',
};

/**
 * Checks if a user with a given role is authorized to access a given pathname.
 * @param role The user's role.
 * @param pathname The path the user is trying to access.
 * @returns `true` if the user is authorized, `false` otherwise.
 */
function isAuthorized(role: string | undefined, pathname: string): boolean {
  // If there's no role, there's no authorization.
  if (!role) {
    return false;
  }

  // Get the list of allowed base paths for this role.
  const allowedPaths = roleAuthorizedBasePaths[role];
  
  // If the role has no defined paths, they aren't authorized for anything.
  if (!allowedPaths) {
    return false;
  }

  // Check if the requested pathname starts with any of the allowed base paths.
  // This also implicitly blocks access to generic '/dashboard' because it's not in any list.
  return allowedPaths.some(base => pathname.startsWith(base));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken');
  const userRole = request.cookies.get('userRole')?.value;

  // Define paths that are always public and do not require authentication
  const publicPaths = ['/login', '/register'];

  // Allow direct access to static assets and API routes, as they have their own logic
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/' // The root path can be a public landing page
  ) {
    return NextResponse.next();
  }

  // --- Handle Authenticated Users ---
  if (authToken) {
    // If an authenticated user tries to access a public path like /login,
    // redirect them to their default dashboard.
    if (publicPaths.includes(pathname)) {
      const redirectUrl = defaultDashboardForRole[userRole || ''] || '/login';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Check if the authenticated user is authorized for the requested path.
    if (isAuthorized(userRole, pathname)) {
      // If authorized, allow the request to proceed.
      return NextResponse.next();
    } else {
      // If not authorized, redirect them to the login page with an error.
      const redirectUrl = '/login?error=unauthorized';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // --- Handle Unauthenticated Users ---
  // If the user is not authenticated and the path is not public,
  // redirect them to the login page with an error.
  if (!publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login?error=unauthenticated', request.url));
  }

  // Allow unauthenticated users to access public paths.
  return NextResponse.next();
}

export const config = {
  // This matcher ensures the middleware runs on all paths except for specific static assets.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};