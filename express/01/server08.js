const express = require("express");
const path = require("path");

const app = express();

app.get("/koty", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/koty.html"));
});

app.get("/aura", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/aura.html"));
});

app.get("/drzewa", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/drzewa.html"));
});

app.use(express.static('static'));

app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
})