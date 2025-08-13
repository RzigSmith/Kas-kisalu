import { Router } from "express";
import multer from "multer";
import * as ctrl from "../controllers/realisation.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.get("/", ctrl.listRealisations);
router.get("/:id", ctrl.getRealisation);
router.post("/", requireAuth, upload.array("photos", 10), ctrl.createRealisation);
router.put("/:id", requireAuth, upload.array("photos", 10), ctrl.updateRealisation);
router.delete("/:id", requireAuth, ctrl.deleteRealisation);

export default router;
