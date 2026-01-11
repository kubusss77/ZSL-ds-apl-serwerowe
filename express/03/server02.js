const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, `/static/pages/strona2.html`));
});

app.post("/fetch", function (req, res) {
    const { num1, num2, dzialanie } = req.body;

    const suma = {
        message: "suma",
        wynik: num1 + num2
    }

    const roznica = {
        message: "roznica",
        wynik: num1 - num2
    }

    const iloraz = {
        message: "iloraz",
        wynik: num1 / num2
    }

    const iloczyn = {
        message: "iloczyn",
        wynik: num1 * num2
    }

    let wynik;

    switch (dzialanie) {
        case "suma": {
            wynik = suma;
            break;
        };
        case "roznica": {
            wynik = roznica
            break;
        };
        case "iloraz": {
            wynik = iloraz
            break;
        };
        case "iloczyn": {
            wynik = iloczyn
            break;
        };
        case "wszystkie": {
            wynik = [
                suma,
                roznica,
                iloraz,
                iloczyn
            ]
            break;
        };
        default: wynik = "blad";
    }

    const string = JSON.stringify(wynik, null, 5)

    res.header("content-type", "application/json");
    res.send(string);
})


app.use(express.static('static'));



app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});