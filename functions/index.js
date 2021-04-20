const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./credentials.json");
const { firestore } = require("firebase-admin");

const app = express();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
app.use(cors());


// ==== EVENTS =====
// create an event and return it's id.
app.post("/rest/events", async (req, res) => {
  let docRef = db.collection("EVENT").doc();

  let data = req.body;

  data.id = docRef.id;
  data.active = true;
  data.createdAt = new Date();

  await docRef.set(data)
  .then(response => {
    return res.status(200).json({message: "Success", eventId: docRef.id});
  })
  .catch(error => {
    return res.status(500).json({message: error});
  })

});

// get event information
app.get("/rest/events/:id", async (req, res) => {
  let docRef = db.collection("EVENT").doc(req.params.id)
  let doc = await docRef.get()

  if (!doc.exists) {
    console.log('No such document!');
      return res.status(500).json({error: "No such document", data: null });
  } else {
    console.log('Document data:', doc.data());
    return res.status(200).json({message: "success", data: doc.data() })
  }
});

app.post("/rest/events/:id", async (req, res) => {
  let docRef = db.collection("EVENT").doc(req.params.id)

  let data = req.body;
  data.updatedAt = new Date();

  await docRef.update(data)
  .then(response => {
    return res.status(200).json({message: "Success"});
  })
  .catch(error => {
    return res.status(500).json({message: error});
  })
});

// add user schedules to event
app.post("/rest/schedules/:id", async (req, res) => {
  // let docRef = db.collection("EVENT").doc(req.params.id).collection("SCHEDULES")
  let docRef = db.collection("EVENT").doc(req.params.id)

  functions.logger.log("Hello from info. Here's an object:", docRef)

  let data = req.body
  data.updatedAt = new Date()

  await docRef.update({
    updatedAt: data.updatedAt,
    schedules: admin.firestore.FieldValue.arrayUnion({...req.body})
  })
  .then(response => {
    return res.status(200).json({message: "Success"});
  })
  .catch(error => {
    return res.status(500).json({message: error});
  })
});


exports.app = functions.https.onRequest(app);
