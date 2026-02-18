
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const db = await getDb();
    const reports = db.collection('reports');
    await reports.updateOne({ id: params.id }, { $set: updates });
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
    const reports = db.collection('reports');
    await reports.deleteOne({ id: params.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
