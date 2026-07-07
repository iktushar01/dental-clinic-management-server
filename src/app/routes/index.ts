import express, { Router } from "express";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { PatientRoutes } from "../module/patient/patient.route";

const router: Router = express.Router();

router.use("/auth", AuthRoute);
router.use("/users", UserRoutes);
router.use("/admins", AdminRoutes);
router.use("/patients", PatientRoutes);


export const IndexRoute: Router = router;
