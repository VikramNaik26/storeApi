require("dotenv").config();
// aysnc errors

const express = require("express");
const app = express();

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send('<h1>Store Api</h1><a href="/api/v1/products">Store</a>');
});

// products routes

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = () => {
  try {
    // connectDb
    app.listen(port, () => {
      console.log("server listening on port 3000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
