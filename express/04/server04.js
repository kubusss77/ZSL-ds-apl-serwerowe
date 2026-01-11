const express = require("express");
const path = require("path");
const formidable = require('formidable');

const app = express();


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, `/static/pages/form2.html`));
});

app.post('/handleUpload', function (req, res) {

    let form = formidable({});

    form.uploadDir = __dirname + '/static/upload/' // folder do zapisu zdjęcia
    form.keepExtensions = true
    form.multiples = true;

    let progress = [];

    let start;
    let start_time;
    form.on("fileBegin", function (name, value) {
        start = "Zaczęcie zapisu pliku: " + name, value
        start_time = new Date().getTime()
    })

    form.on("progress", function (bytesReceived, bytesExpected) {
        progress.push({
            bytesExpected: form.bytesExpected,
            bytesReceived: form.bytesReceived,
            currentTime: new Date().getSeconds() + " sekund, " + new Date().getMilliseconds() + " milisekund"
        })
    })

    let end;
    form.on("end", function () {
        const time = new Date().getTime() - start_time;
        end = "Koniec zapisu: " + time + " milisekund"
    })


    form.parse(req, function (err, fields, files) {
        time = start
        const json = {
            start,
            progress,
            end
        }

        res.header("content-type", "application/json");
        res.send(JSON.stringify(json));
    });
});



app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});