const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, `/static/pages/form1.html`));
});

app.post("/handleForm", function (req, res) {
    const { dzialanie, num1, num2 } = req.body;

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
        case "suma": wynik = suma;
        case "roznica": wynik = roznica;
        case "iloraz": wynik = iloraz;
        case "iloczyn": wynik = iloczyn;
        case "wszystkie": wynik = [
            suma,
            roznica,
            iloraz,
            iloczyn
        ];
        default: wynik = "blad";
    }


    res.header("content-type", "application/json");
    const send = JSON.stringify(wynik, null, 5)
    res.send(send);
})

app.use(express.static('static'));



app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});