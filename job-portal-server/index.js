const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const admin = require('firebase-admin');
const multer = require('multer'); // Import multer
const path = require('path');

const serviceAccount = require('./config/job-portal-demo-8414e-firebase-adminsdk-dwr9w-862fd7ed01.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'job-portal-demo-8414e.appspot.com' // Update this to match your actual bucket name
});


// Get reference to the Firebase storage bucket
const bucket = admin.storage().bucket();

// Set up multer for file handling
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for handling file uploads in-memory

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@litejobs.ro7sm.mongodb.net/?retryWrites=true&w=majority&appName=liteJobs`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let jobcollections, usersCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Initialize collections
    const db = client.db("liteJobs");
    jobcollections = db.collection("jobs");
    usersCollection = db.collection("users");

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process if the connection fails
  }
}

// Connect to the database
connectToDatabase();

// Middleware to verify Firebase ID token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token

  if (!token) return res.sendStatus(401); // No token, unauthorized

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Token verification failed:", error); // Log error details
    return res.status(403).json({ message: 'Invalid token', error: error.message });
  }
}

// User registration
app.post("/register", async (req, res) => {
  const { email, password, username, profilePic } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Email, password, and username are required' });
  }

  // Check if the user already exists
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User with that email already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a user object and insert into the database
  const newUser = {
    email,
    username,
    password: hashedPassword,
    profilePic: profilePic || '' // Save profile picture URL or empty string if not provided
  };

  try {
    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});


// Login request
app.post('/login', async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // You can use decodedToken to fetch additional user details or perform further actions
    const user = await admin.auth().getUser(decodedToken.uid);
    
    // Respond with success
    res.status(200).json({ message: 'Login successful', user: user });
  } catch (error) {
    res.status(403).json({ message: 'Token verification failed', error: error.message });
  }
});

// Protected route to post a job
app.post("/post-job", authenticateToken, async (req, res) => {
  const { jobTitle, CompanyName, minPrice, maxPrice, salaryType, jobLocation, experienceLevel, 
    companyLogo, employmentType, description, skills } = req.body;

  const newJob = {
    jobTitle,
    CompanyName,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    postingDate: new Date(),
    experienceLevel,
    companyLogo,
    employmentType,
    description,
    skills,
    postedBy: req.user.email, // The authenticated user's email from the Firebase ID token
    createdAt: new Date(),
  };

  try {
    const result = await jobcollections.insertOne(newJob);
    if (result.insertedCount > 0) {
      return res.status(200).json({ message: 'Job posted successfully', jobId: result.insertedId });
    } else {
      return res.status(500).json({ message: "Failed to post job" });
    }
  } catch (error) {
    console.error("Error posting job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all jobs
app.get("/all-jobs", async (req, res) => {
  const jobs = await jobcollections.find({}).toArray();
  res.send(jobs);
});

// Get a job by ID
app.get("/all-jobs/:id", async (req, res) => {
  const id = req.params.id;
  const job = await jobcollections.findOne({ _id: new ObjectId(id) });
  res.send(job);
});


// route to apply the job
app.post('/apply/:jobId', upload.single('cv'), authenticateToken, async (req, res) => {
  const { name, email, phone, country, coverLetter } = req.body;
  const cv = req.file;

  console.log('Request Body:', req.body);  // Log form data
  console.log('Uploaded File:', req.file);  // Log uploaded file details
  console.log('Authenticated User:', req.user);  // Log user details

  // Check if all fields are provided
  if (![name, email, phone, country, coverLetter].every(Boolean) || !cv) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const fileName = `${Date.now()}_${cv.originalname}`;
  const file = bucket.file(fileName);

  try {
    console.log("Uploading file to Firebase Storage...");

    // Upload the file to Firebase Storage
    await file.save(cv.buffer, {
      contentType: cv.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: 'randomly-generated-token', // Generate a token for accessing the file
      },
    });

    console.log("File uploaded successfully.");

    // Generate a signed URL for accessing the uploaded CV
    const [downloadURL] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    console.log("Signed URL generated:", downloadURL);

    // Create the application object
    const application = {
      jobId: req.params.jobId,
      name,
      email,
      phone,
      country,
      coverLetter,
      cvUrl: downloadURL,
      submittedAt: new Date(),
    };

    console.log("Inserting application into database...");

    // Save the application details to your database
    const result = await client.db("liteJobs").collection("applications").insertOne(application);

    console.log("Database insert result:", result);

    // Check if insertion was successful
    if (result.insertedCount > 0) {
      return res.status(200).json({ message: 'Application submitted successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to submit application' });
    }
  } catch (error) {
    console.error('Error submitting application:', error);  // Log full error
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Gracefully close the connection when the server shuts down
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
  process.exit(0);
});
