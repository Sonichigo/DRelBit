
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const db = await getDb();
    const content = db.collection('content');
    
    const query = projectId ? { projectId } : {};
    const data = await content.find(query).toArray();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Fetch content failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const items = await request.json();
    const db = await getDb();
    const content = db.collection('content');
    
    if (Array.isArray(items)) {
      await content.insertMany(items);
    } else {
      await content.insertOne(items);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Upload content failed" }, { status: 500 });
  }
}
