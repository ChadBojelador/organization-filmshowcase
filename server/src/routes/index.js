const express = require("express");
const authRouter = require("./authRoutes");
const filmRouter = require("./filmRoutes");
const loginRouter = require("./loginRoutes");
const registerRouter = require("./registerRoutes");

const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => {
  return res.status(200).json({ message: "API is running." });
});

apiRouter.use(loginRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use(filmRouter);
apiRouter.use(registerRouter);

module.exports = apiRouter;
