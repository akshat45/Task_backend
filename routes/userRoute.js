import express from 'express';
import { userLogin, userSignup } from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/validity.js';


const router = express.Router();

router.post('/login', userLogin);
router.post('/signup', userSignup);


export default router;