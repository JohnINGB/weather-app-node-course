const path = require("path");
const express = require("express");
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require("constants");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// set up Handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "John Gales",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "John Gales",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Documentation",
    helpText: "You've come to the right place for help.",
    name: "John Gales",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address.",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    errorMessage: "Help article not found.",
    name: "John Gales",
  });
});

// This needs to come last (404 page)
app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    errorMessage: "Page not found.",
    name: "John Gales",
  });
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
