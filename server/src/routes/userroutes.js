import express from 'express';
export const Userouter=new express.Router()
import { registerUser } from '../controllers/Usercontroller.js';

Userouter.post('/signup', registerUser);


