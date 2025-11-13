import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    
    const { id, content } = await request.json();

    if (!id || content === undefined) {
      return NextResponse.json({ error: 'Post ID and content are required.' }, { status: 400 });
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    await sql`UPDATE posts SET content = ${content} WHERE id = ${id};`;
    
    return NextResponse.json({ success: true, message: `Post ${id} updated.` });

  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json({ error: 'Failed to update post in the database.' }, { status: 500 });
  }
}
