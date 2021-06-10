// Importing
import express from "express";

// App Config
const app = express();
const port = process.env.PORT || 9000;

// Middleware

// DB Config

// ????

// API Routes
app.get("/", (req, res) => res.status(200).send("hello world"));

// Listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
