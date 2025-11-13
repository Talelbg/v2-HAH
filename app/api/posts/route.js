import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const revalidate = 0; // Ensure dynamic data fetching on every request

export async function GET(request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    const sql = neon(process.env.DATABASE_URL);
    const posts = await sql`SELECT * FROM posts ORDER BY id ASC;`;
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch data from the database.' }, { status: 500 });
  }
}
