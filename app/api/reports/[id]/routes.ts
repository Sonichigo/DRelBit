
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

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
