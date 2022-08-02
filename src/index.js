const express = require("express");
const path = require("path");
const conect_db = require("./config/db")
const errorHandler = require("./midleware/error")
const bodyParser = require("body-parser")


conect_db()
const app = express();


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}))
app.use("", express.static(path.join(__dirname, "..", "public")))
app.use("/", require("./routes/Auth"))
app.use("/", require("./routes/views"))
app.use("/", require("./routes/private"))

// should be last peice of midleware
app.use(errorHandler);


const PARTH = process.env.PARTH || 5000;

const server = app.listen(PARTH, () => {
    console.log("listenning at port: ", PARTH);
})

// process.on("unhandledRejection", (err, prms) => 
// {
//     console.log(`Logged Error: ${err}`);

//     server.close(() => process.exit(1))
// })