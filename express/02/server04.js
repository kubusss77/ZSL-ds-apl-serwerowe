const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, `/static/pages/formularzSelecty.html`));
});

app.post("/handleForm", function (req, res) {
    const { count, color, font, size } = req.body;
    if (!count || !color || !font || !size) {
        res.send('Podaj wszystkie dane');
    }

    let sizeInt;
    switch (size) {
        case "small": sizeInt = 100;
        case "medium": sizeInt = 200;
        case "big": sizeInt = 300;
    }

    let html = '';
    for (let i = 0; i < count; i++) {
        html = html + `<div style="border-radius: ${sizeInt}px; color: ${color}; width: ${sizeInt}px; height: ${sizeInt}px;">${i}</div>`;
    }

    res.send(html);
});

app.use(express.static('static'));



app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
    console.log("Server: " + __filename);
});