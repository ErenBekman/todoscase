const express = require('express');
const cors = require('cors');
const path = require("path");
const loaders = require("./loaders");

loaders();
const app = express();


// Middleware
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
    }
));
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", require("./routes"));

// Error Handler
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message });
}); 

// Server
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});