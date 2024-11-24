import express from 'express';
import equipmentController from "../controllers/equipment.controller";
import multer from 'multer';
import validate from '../middlewares/validate';

const equipmentRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

equipmentRouter.post('/identify', [upload.single('image'), validate.userToken], equipmentController.identify)

export default equipmentRouter