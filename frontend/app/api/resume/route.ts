import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isView = searchParams.get('view') === 'true';

  let fileName = 'Mashudh_Ahmed_Resume.pdf';
  let targetUrl = '';

  // 1. Fetch latest resume configuration from backend API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/resume`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data?.fileName) {
        fileName = data.fileName.endsWith('.pdf') ? data.fileName : `${data.fileName}.pdf`;
      }
      if (data?.url) {
        targetUrl = data.url;
      }
    }
  } catch (err) {
    console.error('Failed to fetch resume settings from backend:', err);
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
