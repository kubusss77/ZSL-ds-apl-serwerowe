const express = require("express")
const { create } = require('express-handlebars');
const path = require("path");


const app = express()

const PORT = 3000;

const dane_pocz = {
    "products": [
        {
            "title": "Zestaw herbat świata",
            "slogan": "Aromatyczna podróż dookoła globu",
            "description": "Kolekcja 10 unikalnych, ręcznie zbieranych herbat: od zielonej z Japonii po czarną z Cejlonu i owocową z Polski. Idealne na prezent dla koneserów. Każda saszetka pakowana oddzielnie, chroniąc pełnię aromatu. Zawiera herbaty z kofeiną i bez.",
            "balls": 8,
            "category": "Napoje",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 69.90
        },
        {
            "title": "Ekologiczna torba na zakupy",
            "slogan": "Dbaj o planetę w dobrym stylu",
            "description": "Wytrzymała torba wielokrotnego użytku, wykonana z certyfikowanej bawełny organicznej. Idealna do codziennych zakupów i na podróż. Posiada długie, wygodne uchwyty i małą wewnętrzną kieszonkę na klucze lub telefon. Łatwa do złożenia i schowania.",
            "balls": 10,
            "category": "Akcesoria",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 24.50
        },
        {
            "title": "Mini głośnik bluetooth 'echo'",
            "slogan": "Potężny dźwięk w kieszonkowym rozmiarze",
            "description": "Kompaktowy głośnik bezprzewodowy z głębokim basem. Wodoodporność IPX4 sprawia, że jest idealny na wycieczki i plażę. Bateria wystarcza na 8 godzin ciągłego odtwarzania. W zestawie karabińczyk do łatwego mocowania do plecaka.",
            "balls": 7,
            "category": "Elektronika",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 129.0
        },
        {
            "title": "Notes A5 w twardej oprawie",
            "slogan": "Idealny do planowania i rysowania",
            "description": "Notes ze 180 stronami wysokiej jakości papieru w kropki (dot grid), idealnego do bujo (bullet journal) i szkicowania. Posiada elastyczną gumkę zabezpieczającą i dwie zakładki wstążkowe. Twarda oprawa chroni notatki przed zniszczeniem.",
            "balls": 9,
            "category": "Biuro",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 35.0
        },
        {
            "title": "Abonament na kawę 'premium'",
            "slogan": "Świeżo palona kawa co miesiąc",
            "description": "Subskrypcja na trzy miesiące dostawy 500g świeżo palonej kawy ziarnistej. Za każdym razem inny, starannie wyselekcjonowany gatunek (np. z Brazylii, Etiopii, Kolumbii). Dostawa pod drzwi w cenie. Idealna do ekspresu automatycznego lub metody przelewowej.",
            "balls": 6,
            "category": "Napoje",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 199.0
        },
        {
            "title": "Zestaw śrubokrętów precyzyjnych",
            "slogan": "Niezbędny do naprawy elektroniki",
            "description": "Zestaw 20 precyzyjnych końcówek (torx, pentalobe, phillips) w magnetycznym etui. Idealny do otwierania i naprawy smartfonów, laptopów i małych urządzeń elektronicznych. Rękojeść z antypoślizgowego materiału dla pewnego chwytu.",
            "balls": 5,
            "category": "Narzędzia",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 55.99
        },
        {
            "title": "Książka: 'Podróż w przyszłość'",
            "slogan": "Lektura dla każdego entuzjasty AI",
            "description": "Bestsellerowa książka polskiego autora o wpływie sztucznej inteligencji na rynek pracy i społeczeństwo. Przystępny język, liczne przykłady i prognozy na najbliższe 20 lat. Twarda oprawa, 350 stron.",
            "balls": 10,
            "category": "Książki",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 42.0
        },
        {
            "title": "Podkładka pod mysz ergonomiczna",
            "slogan": "Wsparcie dla Twojego nadgarstka",
            "description": "Podkładka z wbudowaną żelową poduszką wspierającą nadgarstek. Zapobiega zmęczeniu i zespołowi cieśni nadgarstka. Antypoślizgowy spód. Idealna dla programistów, graczy i osób spędzających długie godziny przy komputerze.",
            "balls": 7,
            "category": "Biuro",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 29.99
        },
        {
            "title": "Piknikowy koc wodoodporny",
            "slogan": "Komfort na każdej trawie",
            "description": "Duży koc (200x150 cm) z podszewką wodoodporną, chroniącą przed wilgocią z ziemi. Łatwy do zwinięcia i przenoszenia dzięki rzepowi i uchwytowi. Idealny na pikniki, kemping i festiwale. Materiał zewnętrzny przyjemny w dotyku.",
            "balls": 8,
            "category": "Akcesoria",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 85.0
        },
        {
            "title": "Męski portfel skórzany",
            "slogan": "Klasyka i elegancja w jednym",
            "description": "Ręcznie wykonany portfel ze skóry naturalnej, bydlęcej. Posiada 12 miejsc na karty, kieszonkę na monety zapinaną na zatrzask oraz dwie przegrody na banknoty. Zabezpieczenie RFID chroniące przed nieautoryzowanym skanowaniem.",
            "balls": 9,
            "category": "Akcesoria",
            "img_url": "http://admins.spec.pl.hostingasp.pl/Stefa%C5%84czyk_Dariusz/temp/christmas_ball.png",
            "price": 159.0
        }
    ]
}

let dane = {
    products: Array.from(dane_pocz.products)
};

app.use(express.static('static'))

app.use(express.urlencoded({
  extended: true
}));

const categories = []

dane.products.forEach((product) => {
    if (!categories.includes(product.category)) categories.push(product.category);
})

const hbs = create({
 defaultLayout: 'main.hbs', // Domyślny layout: views/layouts/main.hbs
 extname: '.hbs' // rozszerzenie plików szablonów
});

app.engine('.hbs', hbs.engine); // określenie silnika szablonów
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // ustalamy katalog views

app.get("/", function (req, res) {
    res.render('index.hbs', dane);   // nie podajemy ścieżki tylko nazwę pliku
})

const oceny = []
for(let i = 1; i < 11; i++) {
    const ocena = [];
    for(let j = 0; j< i; j++) {
        ocena.push(j)
    }
    oceny.push({
        ocena,
        index: i
    });
    
}

app.get("/add", function(req, res) {
    res.render("add.hbs", {
        categories,
        oceny
    })
})

app.post("/add", function(req, res) {
    const { title, slogan, description, category, ocena, price } = req.body;
    dane.products.push({
        title,
        slogan,
        description,
        category,
        balls: ocena ? ocena : "brak",
        price
    })

    res.redirect('/')
})

app.post("/search", function(req, res) {
    
})

app.post("/reset", function(req, res) {
    dane = {
        products: Array.from(dane_pocz.products)
    };
    res.redirect("/")
})

app.get("/edit", function(req, res) {
    const index = parseInt(req.query.product)
    res.render('edit.hbs', { 
        product: dane.products[index],
        categories,
    });
})


app.listen(PORT, function () {
 console.log("start serwera na porcie " + PORT )
})