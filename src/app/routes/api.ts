import express from 'express';

const router = express.Router();
import apiController from "../controllers/apiController";

router.get('/',apiController.home);
export default router;
