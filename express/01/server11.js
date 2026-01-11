const express = require("express");
const path = require("path");

const app = express();

app.get("/product_id/:id", function (req, res) {
    const { id } = req.params;

    res.sendFile(path.join(__dirname, `/static/products/product${id}.html`));
});


app.use(express.static('static'));

app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
})