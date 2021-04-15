const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./credentials.json");

const app = express();
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/", (req, res) => {
  return res.status(200).json({message: "Hello world"});
});

exports.app = functions.https.onRequest(app);
