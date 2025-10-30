import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.redirect(new URL(`/dashboard?error=${error}`, request.url));
  }
  
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url));
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google-calendar`,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokens = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokens);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url));
    }
    
    // Store the access token in URL params to be saved by the client
    const redirectUrl = new URL('/dashboard', request.url);
    redirectUrl.searchParams.set('google_token', tokens.access_token);
    if (tokens.refresh_token) {
      redirectUrl.searchParams.set('google_refresh_token', tokens.refresh_token);
    }
    redirectUrl.searchParams.set('sync_success', 'true');
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }
}

