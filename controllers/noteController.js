const noteModel = require("../models/note");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
// app.use(express.static("./public"));

const createNote = async (req, res) => {
  const { title, description } = req.body;

  const newNote = new noteModel({
    title: title,
    description: description,
    userId: req.userId,
  });

  try {
    await newNote.save(); // to add the data into the db.
    console.log("newNote :>> ", newNote);
    res.status(201).json(newNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateNote = async (req, res) => {
  try {
    let id = req.params.id;
    console.log("id :>> ", typeof id);
    const { title, description } = req.body;

    const newNote = {
      title: title,
      description: description,
      userId: req.userId,
    };

    await noteModel.findByIdAndUpdate(id, newNote, { new: true }); // new true means it return the new updated object.
    res.status(200).json(newNote);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteNote = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedNote = await noteModel.findByIdAndDelete(id, { new: true });
    // in the deletion request we use the status code of 202
    res.status(202).json(deletedNote);
  } catch (err) {
    console.log("error :>> ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getNotes = async (req, res) => {
  try {
    const getNote = await noteModel.find({ userId: req.userId });
    if (getNote === undefined || getNote.length == 0) {
      res.status(200).json({ message: "No topic found" });
    } else {
      res.status(200).json(getNote);
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const uploadImage = async (req, res) => {
  



  // Set up AWS S3 configuration
  AWS.config.update({
    accessKeyId: 'AKIAV24VHNKHWL2HXASX',
    secretAccessKey: '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',
    region:'us-east-1',
  });

  // Create an S3 instance
  const s3 = new AWS.S3();

  // Define the S3 bucket and a unique key for the image
  const bucketName = "s3-nodejs-12345";
  const key = "./uploads"; // Replace with your desired S3 path

  // Read the image file from your local directory
  const filePath = path.join(__dirname, "image1.jpg");
  const fileContent = fs.readFileSync(filePath);

  // Set up the parameters for the upload
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };

  // Upload the image to S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading image to S3:", err);
    } else {
      
      console.log("Image uploaded to S3 successfully. S3 URL:", data.Location);
    }
  });

  // const upload =  multer({
  //   storage: multer.diskStorage({
  //     destination:(req,res,cb)=>{
  //       cb(null, 'uploads')
  //     },
  //     filename: (req,file,cb)=>{
  //       cb(null,file.fieldname + '-' + Date.now()+ '.jpg')

  //     }
  //   })
  // }).single('user_file');
  // console.log('req.file :>> ', req.file);

  // upload(req, res, (err) => {
  //   console.log('err :>> ', err);
  //   if (err) {
  //     res.status(400).send("Something went wrong!");
  //   }
  //   console.log('res.send(req.file) :>> ',req.file);
  //   res.status(200).send("success fully uploaded");
  // });
  // res.status(200).json({ message: "file uploaded" });
};

module.exports = { createNote, updateNote, deleteNote, getNotes, uploadImage };
