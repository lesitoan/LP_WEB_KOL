import { NextResponse, type NextRequest } from 'next/server'

// const KOL_PUBLIC_PATHS = ['/login']
const ADMIN_PUBLIC_PATHS = ['/admin/login']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon')
  ) {
    return NextResponse.next()
  }

  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    const adminAccessToken = req.cookies.get('adminAccessToken')?.value
    const isAdminPublic = ADMIN_PUBLIC_PATHS.includes(pathname)

    if (!adminAccessToken && !isAdminPublic) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (adminAccessToken && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return NextResponse.next()
  }

  // const accessToken = req.cookies.get('accessToken')?.value
  // const isKolPublic = KOL_PUBLIC_PATHS.includes(pathname)
  //
  // if (!accessToken && !isKolPublic) {
  //   const loginUrl = new URL('/login', req.url)
  //   loginUrl.searchParams.set('redirect', pathname)
  //   return NextResponse.redirect(loginUrl)
  // }
  //
  // if (accessToken && pathname === '/login') {
  //   return NextResponse.redirect(new URL('/dashboard', req.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\.).*)'],
}
