
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const db = await getDb();
    const users = db.collection('users');
    
    const user = await users.findOne({ username: username.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ 
      username: user.username, 
      role: user.role 
    });
  } catch (error: any) {
    console.error('Login error:', error);
    const message = error.message === 'DATABASE_UNAVAILABLE' 
      ? "Database unreachable. Check Atlas IP whitelist." 
      : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
