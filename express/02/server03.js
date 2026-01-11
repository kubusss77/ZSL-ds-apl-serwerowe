const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, `/static/pages/formularzPost.html`));
});

app.post("/handleForm", function (req, res) {
    const { color } = req.body;

    if (color == '#000000') {
        res.send(req.body);
    } else {
        res.send(`<html><body style="background: ${color}"><h1>${color}</h1></body></html>`);
    }
})

app.use(express.static('static'));



app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
    console.log("Server: " + __filename);
});