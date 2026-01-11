const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, `/static/pages/strona3.html`));
});

const logowania = [];

app.post("/fetch", function (req, res) {
    const { imie, nazwisko } = req.body;

    logowania.push({
        message: "logowanie klienta",
        name: imie,
        lastname: nazwisko,
        logtime: Date.now()
    })

    const string = JSON.stringify(logowania, null, 5)

    res.header("content-type", "application/json");
    res.send(string);
})


app.use(express.static('static'));



app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});