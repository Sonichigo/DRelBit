
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const projects = db.collection('projects');
    const data = await projects.find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Fetch projects failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const project = await request.json();
    const db = await getDb();
    const projects = db.collection('projects');
    await projects.insertOne(project);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Create project failed" }, { status: 500 });
  }
}
