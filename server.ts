
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI || "";

app.use(cors());
app.use(express.json());

let db: any;

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('Content_pro');
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();

// --- AUTH ROUTES ---

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const users = db.collection('users');
    
    const existing = await users.findOne({ username: username.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Username taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      username: username.toLowerCase(),
      password: hashedPassword,
      role: role || 'editor',
      createdAt: new Date()
    });

    res.json({ username, role: role || 'editor', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = db.collection('users');
    
    const user = await users.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// --- CONTENT ROUTES ---

app.get('/api/content', async (req, res) => {
  try {
    const { projectId } = req.query;
    const content = db.collection('content');
    const query = projectId ? { projectId } : {};
    const data = await content.find(query).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Fetch content failed" });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const items = req.body;
    const content = db.collection('content');
    await content.insertMany(items);
    res.json({ success: true, count: items.length });
  } catch (error) {
    res.status(500).json({ error: "Upload content failed" });
  }
});

// --- PROJECT ROUTES ---

app.get('/api/projects', async (req, res) => {
  try {
    const projects = db.collection('projects');
    const data = await projects.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Fetch projects failed" });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = req.body;
    const projects = db.collection('projects');
    await projects.insertOne(project);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Create project failed" });
  }
});

// --- REPORT ROUTES ---

app.get('/api/reports', async (req, res) => {
  try {
    const { projectId } = req.query;
    const reports = db.collection('reports');
    const data = await reports.find({ projectId }).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Fetch reports failed" });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const report = req.body;
    const reports = db.collection('reports');
    await reports.insertOne(report);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Create report failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
