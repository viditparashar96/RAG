import express from "express";
import {
  chatWithProject,
  createProject,
  getChatHistoryByTableId,
  getProject,
} from "../controllers/project.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
const router = express.Router();

router
  .route("/create")
  .post(authenticateUser, upload.single("file"), createProject);
router.route("/getprojects").get(authenticateUser, getProject);
router.route("/chat/:table_id").post(authenticateUser, chatWithProject);
router
  .route("/getchats/:table_id")
  .get(authenticateUser, getChatHistoryByTableId);

module.exports = router;
