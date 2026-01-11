const express = require("express");
const path = require("path");
const formidable = require('formidable');

const app = express();


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, `/static/pages/form1.html`));
});

app.post('/handleUpload', function (req, res) {

    let form = formidable({});

    form.uploadDir = __dirname + '/static/upload/' // folder do zapisu zdjęcia
    form.keepExtensions = true

    form.parse(req, function (err, fields, files) {

        console.log("----- przesłane pola z formularza ------");

        console.log(fields);

        console.log("----- przesłane formularzem pliki ------");

        console.log(files);

        const json = [
            fields,
            files.photo
        ]

        res.header("content-type", "application/json");
        res.send(JSON.stringify(json));
    });
});



app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});