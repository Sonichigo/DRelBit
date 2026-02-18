
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const db = await getDb();
    const projects = db.collection('projects');
    await projects.updateOne({ id: params.id }, { $set: updates });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const projects = db.collection('projects');
    const content = db.collection('content');
    const reports = db.collection('reports');
    
    // Cascade delete project data
    await projects.deleteOne({ id: params.id });
    await content.deleteMany({ projectId: params.id });
    await reports.deleteMany({ projectId: params.id });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
