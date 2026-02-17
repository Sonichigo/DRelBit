
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json();
    const db = await getDb();
    const users = db.collection('users');
    
    // Ensure the index exists, which forces Atlas metadata to update
    await users.createIndex({ username: 1 }, { unique: true });

    const existing = await users.findOne({ username: username.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Username taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      username: username.toLowerCase(),
      password: hashedPassword,
      role: role || 'editor',
      createdAt: new Date()
    });

    console.log(`DEBUG [Auth]: Registered new cloud user: ${username}`);

    return NextResponse.json({ 
      username, 
      role: role || 'editor', 
      id: result.insertedId 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    const message = error.message === 'DATABASE_UNAVAILABLE' 
      ? "Database unreachable. Check Atlas IP whitelist." 
      : "Signup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
