// Importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";

// App Config
const app = express();
const port = process.env.PORT || 9000;

// Middleware
app.use(express.json());

// DB Config
const connection_url = "mongodb+srv://admin:vI9ZHxHLvVupTyQo@cluster0.iixou.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ????

// API Routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(`New message created: \n ${data}`);
        }
    });
});

// Listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
