import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetPath = body.path || '/';

    // Revalidate the specified page and root layout so all cached components update instantly
    revalidatePath(targetPath, 'page');
    revalidatePath(targetPath, 'layout');

    return NextResponse.json({
      revalidated: true,
      path: targetPath,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error revalidating', error: error?.message },
      { status: 500 }
    );
  }
}
