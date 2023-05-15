import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import userModel from "../models/userModel.js";
import { Err } from "../helpers/errorHandler.js";

export const userLogin = (req, res, next) => {
    const { name, password } = req.body;
    console.log(name);
    // check for user exsistance and token sign
    userModel.findOne({ name: name })
        .then((data) => {
            console.log(data);
            if (data) {
                bcrypt.compare(password, data.password)
                    .then((check) => {

                        if (check) {
                            const token = jwt.sign({ name: data.name, _id: data._id, role: data.role }, process.env.hashtoken);
                            return res.status(200).json({ token, name: data.name, _id: data._id,role:data.role, message: "You are logged in successfully." });
                        }
                        else
                            throw new Err('Invalid Credentials.', 403);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
            else
                throw new Err("Username does not exist.", 403);
        })
        .catch((err) => {
            next(err);
        });
};

export const userSignup = async (req, res, next) => {
    const { name, password, role } = req.body;
    console.log("Hi");
    // check duplicate username
    await userModel.findOne( { name } )
        .then((data) => {

        })
        .catch((err) => {
            next(err);
        });

    // hashing password and creating user
    bcrypt.hash(password, 4)
        .then((hash) => {
            userModel.create({ name, password: hash, role })
                .then((data) => {
                    
                    const token = jwt.sign(
                        { name: data.name, _id: data._id, role: data.role },
                        process.env.hashtoken
                    );

                    return res.status(200).json({ token, role:data.role, name: data.name, _id: data._id, message: "You are signuped successfully." });
                })
                .catch((err) => {
                    next(err);
                });
        })
        .catch((err) => {
            next(err);
        });
};


