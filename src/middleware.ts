import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	
	if (path.startsWith("/test")) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"]
};

