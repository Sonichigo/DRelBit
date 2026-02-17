import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env');
}

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

async function connectWithLogging(uri: string) {
  const clientInstance = new MongoClient(uri, options);
  try {
    console.log("DEBUG [MongoDB]: Initiating connection to Atlas cluster...");
    const connectedClient = await clientInstance.connect();
    
    // Verify connectivity by pinging the admin database
    // This is crucial for detecting IP Whitelist issues early
    await connectedClient.db("admin").command({ ping: 1 });
    console.log("DEBUG [MongoDB]: Atlas connection verified successfully.");
    
    return connectedClient;
  } catch (err: any) {
    console.error("DEBUG [MongoDB]: CRITICAL - Connection failed.");
    console.error("ERROR TYPE:", err.name);
    console.error("ERROR MESSAGE:", err.message);
    
    if (err.name === 'MongoServerSelectionError' || err.message.includes("timed out") || err.message.includes("ETIMEDOUT")) {
      console.error("HINT: Database connection timed out. This almost always means your current IP address is NOT whitelisted in MongoDB Atlas Network Access.");
      console.error("ACTION REQUIRED: Go to Atlas Dashboard > Network Access > Add IP Address. Add '0.0.0.0/0' temporarily to test.");
    }
    throw err;
  }
}

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectWithLogging(uri);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = connectWithLogging(uri);
}

export default clientPromise;

export async function getDb() {
  try {
    const client = await clientPromise;
    return client.db('Content_pro');
  } catch (e) {
    console.error("DEBUG [MongoDB]: Could not acquire database handle.", e);
    throw new Error("DATABASE_UNAVAILABLE");
  }
}