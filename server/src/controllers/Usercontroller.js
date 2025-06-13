import { User } from "../models/usermodel.js";

export const registerUser = (req, res) => {
  User.create(req.body, (err, result) => {
    if (err) return res.status(500).send('DB error');
    res.status(201).send('User registered');
  });
};
