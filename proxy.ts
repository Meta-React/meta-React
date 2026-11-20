

import { NextRequest, NextResponse } from 'next/server';

function unauthorizedResponse(): NextResponse {
    return new NextResponse('Authentication required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Protected Area", charset="UTF-8"',
        },
    });
}

export function proxy(req: NextRequest) {

    //console.log('proxy');

    const user = process.env.BASIC_AUTH_USER;
    const password = process.env.BASIC_AUTH_PASSWORD;

    if (!user || !password) {
        return NextResponse.next();
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return unauthorizedResponse();
    }

    let decoded = '';
    try {
        decoded = atob(authHeader.slice('Basic '.length).trim());
    } catch {
        return unauthorizedResponse();
    }

    const sepIndex = decoded.indexOf(':');
    if (sepIndex === -1) {
        return unauthorizedResponse();
    }

    const reqUser = decoded.slice(0, sepIndex);
    const reqPass = decoded.slice(sepIndex + 1);

    if (reqUser !== user || reqPass !== password) {
        return unauthorizedResponse();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};