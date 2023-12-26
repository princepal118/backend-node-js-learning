const noteModel = require("../models/note");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const noteImageModel = require("../models/note-url");

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
    console.log("error :>> ", err);
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
  try {
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.S3_BUCKET_REGION,
    });
    // The optional contentType option can be used to set Content/mime type of the file. By default the content type is set to application/octet-stream. If you want multer-s3 to automatically find the content-type of the file, use the multerS3.AUTO_CONTENT_TYPE constant. Here is an example that will detect the content type of the file being uploaded.
    const s3Storage = multerS3({
      s3: s3,
      bucket: "s3-nodejs-12345",
      acl: "public-read",
      metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
      },
      cacheControl: "max-age=31536000",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      storageClass: "REDUCED_REDUNDANCY",
      key: (req, file, cb) => {
        const fileName =
          Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
      },
    });

    const upload = multer({ storage: s3Storage }).single("user_file");
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ message: "Something went wrong" });
      }
      const imageCreation = new noteImageModel({
        photoUrl: req.file.location,
        userId: req.userId,
      });
      const uploadImageInMongo = await imageCreation.save();
      res
        .status(200)
        .send({ message: { sucess: true, data: uploadImageInMongo.photoUrl } });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { createNote, updateNote, deleteNote, getNotes, uploadImage };
