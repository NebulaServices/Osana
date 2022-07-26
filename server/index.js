const express = require("express");
const app = express();
app.use(express.static("static"));
app.use(express.static("dist"));
app.listen(process.env.PORT || 3000);
console.log(`Server running on port ${process.env.PORT || 3000}`);
