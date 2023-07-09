const express = require("express");


const app = express();

require("dotenv").config({ path: "./env/dev.env" })



const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
});

