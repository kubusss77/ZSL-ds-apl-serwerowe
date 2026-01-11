const express = require("express");
const path = require("path");

const app = express();

app.get("/", function (req, res) {
    const { value, toRad } = req.query;

    let result;

    if(toRad == "false") {
        result = value * (180/ 3.1415);
    } else {
        result = value / (180/ 3.1415);
    }

    res.send(`<h3>value: ${value}</h3>` + `<h3>toRad: ${toRad}` + `<h1>result: ${result}</h1>`);
});


app.use(express.static('static'));

app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
})