const express = require("express");
const userRoutes = require("./router/userRoutes");
const noteRoutes = require("./router/noteRoutes");
const cors = require('cors')

// const quote = require("./quote.json").quotes;
//user|| admin, related endpoint will be in new file

const mongoose = require("mongoose");
const app = express();
app.use(express.json()); // it converts the request body into JSON and parse into the JSON.
// console.log('corsnjjj :>> ', cors.corsMiddleware);
app.use("/users", userRoutes);
app.use(cors()); // using cors 
app.use((req, res, next) => {
  next();
});


app.use("/note", noteRoutes);
// app.get("/", (req, res) => {
//   res.status(200).json(quote);
// });
// app.get("/quote", (req, res) => {
//   res.send("quote");
// });

mongoose
  .connect(
    "mongodb+srv://admin:PRince%40%231010@cluster1.vr6apo9.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("listening port......., 5000");
    });
  })
  .catch((error) => {
    console.log("error  in the mongo case.:>> ", error);
  });
