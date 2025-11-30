const express = require('express');
const path = require('path');
let dane = require('./dane.json');
const { create } = require('express-handlebars');

const app = express();

app.use(express.static('static'));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const hbs = create({
  defaultLayout: 'main.hbs', // Domyślny layout: views/layouts/main.hbs
  extname: '.hbs', // rozszerzenie plików szablonów
});

app.engine('.hbs', hbs.engine); // określenie silnika szablonów
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // ustalamy katalog views

const categories = [];
dane.products.forEach((product) => {
  if (!categories.includes(product.category)) {
    categories.push(product.category);
  }
});

app.get('/', function (req, res) {
  const context = {
    products: dane.products.map((product, index) => {
      return {
        index,
        title: product.title,
        category: product.category,
        img_url: product.img_url,
        reviews: product.reviews.length
          ? (product.reviews.reduce((ac, el) => ac + el.stars, 0) / product.reviews.length).toFixed(2)
          : 'Brak opinii',
        price: product.price,
      };
    }),
    categories,
  };
  res.render('index.hbs', context);
});

app.get('/filter', function (req, res) {
  const { category, avg } = req.query;

  const context = {
    filter: true,
    products: dane.products
      .map((product, index) => {
        if (product.category != category) {
          return null;
        }

        const reviewsAverage = (product.reviews.reduce((ac, el) => ac + el.stars, 0) / product.reviews.length).toFixed(
          2
        );
        if (reviewsAverage < avg || (avg && isNaN(reviewsAverage))) {
          return null;
        }

        return {
          index,
          title: product.title,
          category: product.category,
          img_url: product.img_url,
          reviews: product.reviews.length ? reviewsAverage : 'Brak opinii',
          price: product.price,
        };
      })
      .filter((prod) => prod != null),
    categories,
  };
  res.render('index.hbs', context);
});

app.get('/:productId', function (req, res) {
  const { productId } = req.params;

  productDesc = dane.products[productId];

  const context = {
    index: productId,
    ...productDesc,
    reviewsAverage: productDesc.reviews.length
      ? (productDesc.reviews.reduce((ac, el) => ac + el.stars, 0) / productDesc.reviews.length).toFixed(2)
      : '',
  };

  res.render('description.hbs', context);
});

app.get('/:productId/reviews', function (req, res) {
  const { productId } = req.params;

  productDesc = dane.products[productId];

  const context = {
    index: productId,
    ...productDesc,
    reviewsAverage: productDesc.reviews.length
      ? 'Średnia opini: ' +
        (productDesc.reviews.reduce((ac, el) => ac + el.stars, 0) / productDesc.reviews.length).toFixed(2)
      : 'Brak opini',
  };

  res.render('reviews.hbs', context);
});

app.post('/:productId/add-comment', function (req, res) {
  const { productId } = req.params;
  const { name, comment, stars } = req.body;

  dane.products[productId].reviews.push({
    name,
    comment,
    stars: parseInt(stars),
  });

  res.redirect('/' + productId);
});

app.listen(4000, function () {
  console.log('start serwera');
});
