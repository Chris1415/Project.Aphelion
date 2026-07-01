import { NextRequest, NextResponse } from 'next/server';
import client from 'lib/sitecore-client';

/**
 * TEMP dev-only layout capture (custom_content-sdk-debug-layout-probe).
 *
 * Returns the raw `getPage` LayoutServiceData for a path so tests can freeze it
 * as a real fixture. 404s in production so it never ships.
 *
 *   GET /api/layout-debug?path=/Group-1-Test
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 });
  }

  const sp = req.nextUrl.searchParams;
  const raw = sp.get('path') ?? '/';
  const segments = raw.split('/').filter(Boolean); // mirror the catch-all: string[] of segments
  const site = sp.get('site') ?? process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME ?? 'aphelion';
  const locale = sp.get('locale') ?? process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en';

  try {
    const page = await client.getPage(segments, { site, locale });
    return NextResponse.json({ ok: true, path: raw, site, locale, layout: page?.layout ?? null });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
