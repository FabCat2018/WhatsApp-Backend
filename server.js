// Importing
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";

// App Config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1217947",
    key: "750cf084b90b10c2bb4f",
    secret: "38f5119a83edaa7d645e",
    cluster: "eu",
    useTLS: true
});

// Middleware
app.use(express.json());
app.use(cors());

// DB Config
const connection_url = "mongodb+srv://admin:vI9ZHxHLvVupTyQo@cluster0.iixou.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("DB connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log("A change occurred", change);

        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted",
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received
                }
            );
        } else {
            console.log("Error triggering Pusher");
        }
    });
});

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
