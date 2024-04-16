import cors from "cors";
import express, { Application, Request, Response } from "express";
import { userRoute } from "./app/modules/user/user.route";
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        status: true,
        message: "Management Server is running",
    });
});

export default app;
