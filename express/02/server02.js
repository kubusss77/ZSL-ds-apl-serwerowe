const express = require("express");
const path = require("path");

const app = express();

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, `/static/pages/formularz.html`));
});

app.get("/handleForm", function (req, res) {
    const { color } = req.query;

    res.send(`<html><body style="background: ${color}"><h1>${color}</h1></body></html>`)
})

app.use(express.static('static'));



app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});