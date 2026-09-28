import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function sanitizeFilename(name: string): string {
  // Strip control chars, quotes, and invalid filesystem characters
  let clean = name.replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, ' ').trim();
  if (!clean.toLowerCase().endsWith('.pdf')) {
    clean += '.pdf';
  }
  return clean || 'Mashudh_Ahmed_Resume.pdf';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isView = searchParams.get('view') === 'true';

  let rawFileName = 'Mashudh_Ahmed_Resume.pdf';
  let targetUrl = '';

  // 1. Fetch latest resume configuration from backend API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/resume`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data?.fileName) {
        rawFileName = data.fileName;
      }
      if (data?.url) {
        targetUrl = data.url;
      }
    }
  } catch (err) {
    console.error('Failed to fetch resume settings from backend:', err);
  }

  const fileName = sanitizeFilename(rawFileName);

  // Health-check / verification mode for Admin Panel
  if (searchParams.get('check') === 'true') {
    if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
      try {
        const testRes = await fetch(targetUrl, { method: 'GET' });
        const cldError = testRes.headers.get('x-cld-error');
        if (testRes.ok) {
          return NextResponse.json({
            ok: true,
            status: 'valid',
            httpCode: testRes.status,
            size: testRes.headers.get('content-length'),
            targetUrl,
            fileName,
          });
        }
        return NextResponse.json({
          ok: false,
          status: 'invalid',
          httpCode: testRes.status,
          error: cldError || `HTTP ${testRes.status}`,
          targetUrl,
          fileName,
        });
      } catch (err: any) {
        return NextResponse.json({
          ok: false,
          status: 'error',
          error: err.message,
          targetUrl,
          fileName,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      status: 'valid',
      httpCode: 200,
      source: 'local',
      targetUrl: targetUrl || '/resume.pdf',
      fileName,
    });
  }

  const dispositionType = isView ? 'inline' : 'attachment';

  // 2. If targetUrl is an external link (Cloudinary, Drive, etc.), fetch and stream it
  if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
    try {
      const remoteRes = await fetch(targetUrl);
      if (remoteRes.ok) {
        const buffer = await remoteRes.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `${dispositionType}; filename="${fileName}"`,
            'Cache-Control': 'public, max-age=600',
          },
        });
      }
      console.warn(`Remote resume URL returned status ${remoteRes.status}, falling back to local file`);
    } catch (remoteErr) {
      console.error('Failed to stream remote resume, falling back to local file:', remoteErr);
    }
  }

  // 3. Fallback: Serve local public/resume.pdf with guaranteed filename
  try {
    const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `${dispositionType}; filename="${fileName}"`,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  } catch (fsErr) {
    console.error('Failed to read local resume.pdf:', fsErr);
  }

  return new NextResponse('Resume document not found', { status: 404 });
}
