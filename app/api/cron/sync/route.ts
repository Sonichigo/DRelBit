
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    // Simple secret check for internal cron triggers
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // return NextResponse.json({ error: "Unauthorized Heartbeat" }, { status: 401 });
    }

    const db = await getDb();
    const projects = db.collection('projects');
    const content = db.collection('content');

    const activeProjects = await projects.find({ spreadsheetUrl: { $exists: true, $ne: "" } }).toArray();
    let totalUpserted = 0;

    for (const project of activeProjects) {
      console.log(`CRON [Sync]: Fetching data for workspace ${project.name}`);
      
      try {
        const response = await fetch(project.spreadsheetUrl);
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

        const uniqueItemsMap = new Map();

        jsonData.forEach((row, idx) => {
          const findVal = (keys: string[]) => {
            const key = Object.keys(row).find(k => {
              const clean = k.toLowerCase().replace(/[^a-z0-9]/g, '');
              return keys.some(t => clean.includes(t.replace(/[^a-z0-9]/g, '')));
            });
            return key ? row[key] : null;
          };

          const parseNum = (val: any) => Math.abs(parseFloat(String(val || '0').replace(/[^\d.-]/g, ''))) || 0;
          const parseList = (val: any) => String(val || '').split(',').map(s => s.trim()).filter(Boolean);

          const desc = findVal(['page', 'url', 'description', 'title']) || `sync-${Date.now()}-${idx}`;
          
          const item = {
            projectId: project.id,
            date: findVal(['date', 'timestamp']) || new Date().toISOString().split('T')[0],
            platform: 'SEO',
            type: 'Automated Sync',
            author: 'Cron System',
            description: desc,
            impressions: parseNum(findVal(['impressions', 'reach'])),
            views: parseNum(findVal(['views', 'clicks'])),
            engagement: parseNum(findVal(['engagement', 'ctr'])),
            events: parseList(findVal(['events', 'milestones'])),
            communities: parseList(findVal(['communities', 'subreddits', 'groups', 'mentions']))
          };

          uniqueItemsMap.set(desc, item);
        });

        const finalItems = Array.from(uniqueItemsMap.values());
        if (finalItems.length > 0) {
          const operations = finalItems.map(item => ({
            updateOne: {
              filter: { projectId: item.projectId, description: item.description },
              update: { $set: item },
              upsert: true
            }
          }));
          const result = await content.bulkWrite(operations);
          totalUpserted += (result.upsertedCount + result.modifiedCount);
        }
      } catch (err) {
        console.error(`CRON [Error]: Failed project ${project.name}:`, err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      processedCount: totalUpserted
    });
  } catch (error) {
    console.error("Cron Execution Failure:", error);
    return NextResponse.json({ error: "Internal Sync Fault" }, { status: 500 });
  }
}
