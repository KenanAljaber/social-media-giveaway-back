const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

require("dotenv").config({ path: "./env/dev.env" })

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

const commentsMethods = require("./methods/comments_methods");




const commentsRoutes = require("./routes/comments_routes")(express.Router(), commentsMethods);

app.use("/comments", commentsRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
});

