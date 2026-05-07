const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const apiRouter = require("./routes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  env.clientUrl,
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server (no origin) and Vercel preview URLs
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/[\w-]+\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

// Only listen locally — Vercel handles this in production
if (process.env.VERCEL !== "1") {
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

module.exports = app;
