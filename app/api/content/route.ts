
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
    
    const itemsArray = Array.isArray(items) ? items : [items];
    
    if (itemsArray.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // Use bulkWrite to perform upserts based on projectId and description (URL)
    // This prevents duplicate entries for the same page/URL in the same project
    const operations = itemsArray.map((item) => ({
      updateOne: {
        filter: { 
          projectId: item.projectId, 
          description: item.description 
        },
        update: { $set: item },
        upsert: true
      }
    }));

    const result = await content.bulkWrite(operations);
    
    return NextResponse.json({ 
      success: true, 
      upsertedCount: result.upsertedCount, 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error("Content Upload Error:", error);
    return NextResponse.json({ error: "Upload content failed" }, { status: 500 });
  }
}
