// Importing necessary modules
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

app.use(cors(corsOptions));

app.use(logger);

app.use(express.json());

app.use(cookieParser());

// Serving static files from the 'public' directory
app.use("/", express.static(path.join(__dirname, "public")));

// Handling routes using the root file
app.use("/", require("./routes/root"));

// Handling 404 errors for undefined routes
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send(" 404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
