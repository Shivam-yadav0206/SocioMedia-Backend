import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { tmpdir } from "os";
import { join } from "path";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Use /tmp for temporary storage
    const tempFilePath = join(tmpdir(), "temp-file.jpg");

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: tempFilePath, // Use the temporary file path
      friends,
      location,
      occupation,
      viewedProfile: 25,
      impressions: 17,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log("Error saving");
    res.status(500).json({ error: err.message });
  }
};

//LOGGING IN
export const login = async(req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) return res.status(400).json({msg:"User does not find"});

        const ismatch = await bcrypt.compare(password, user.password);
        if(!ismatch) return res.status(400).json({msg:"Invalid credentials"});

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token,user});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};





























