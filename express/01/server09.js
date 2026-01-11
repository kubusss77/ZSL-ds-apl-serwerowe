const express = require("express");
const path = require("path");

const app = express();

app.get("/", function (req, res) {
    const { count, bg } = req.query;

    let body = "";
    const div = `<div style="width: 100px; height: 100px; background: ${bg}; margin: 10px\"></div>`;

    for (let i = 0; i < count; i++) {
        body = body + div;
    }

    res.send('<body style="display: flex; flex-flow: wrap">' + body + '</body>');
});


app.use(express.static('static'));

app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
})