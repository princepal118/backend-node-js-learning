const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";
const signup = async (req, res) => {

  const { username, email, password } = req.body;
  // console.log('req.body :>> ', req.body);
  try {
    const exixtingUser = await userModel.findOne({ email: email }); //this function will connect with the database and find the user email existes or not.
    if (exixtingUser) {
      return res.status(400).json({ message: "User Already Exists." });
    }
    //creating hashed password.
    const hashedPassword = await bcrypt.hash(password, 10);

    //User Creation.
    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
    });
    //Token Generation
    // pass the id which is created by the mongo db for the token is userId
    const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);

    console.log('token in sign up case :>> ', token);
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log("error in sign Up ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exixtingUser = await userModel.findOne({ email: email });
    if (!exixtingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, exixtingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: exixtingUser.email, id: exixtingUser._id },
      SECRET_KEY
    );
    res.status(201).json({ user: exixtingUser, token: token });
  } catch (error) {
    console.log("error in the signup case", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signin, signup };
