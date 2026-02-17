
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const db = await getDb();
    const reports = db.collection('reports');
    const query = projectId ? { projectId } : {};
    const data = await reports.find(query).toArray();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Fetch reports failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const report = await request.json();
    const db = await getDb();
    const reports = db.collection('reports');
    await reports.insertOne(report);
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Create report failed" }, { status: 500 });
  }
}
