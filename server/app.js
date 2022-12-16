//install dependencies
const express = require("express");
const app = express();
const PORT = 8000;
const cheerio = require("cheerio");
const axios = require("axios");

//to be able to scrape multiple many newspaper --> loop throughh all of these and perform same operations
const newspapers = [
  {
    name: "newyorktimes",
    url: "https://www.nytimes.com/section/politics",
  },
  {
    name: "nypost",
    url: "https://nypost.com/tag/politics/",
  },
  {
    name: "cbs",
    url: "https://www.cbsnews.com/latest/politics/",
  },
  {
    name: "wsj",
    url: "https://www.wsj.com/news/politics",
  },
  {
    name: "cnn",
    url: "https://www.cnn.com/politics",
  },
  {
    name: "npr",
    url: "https://www.npr.org/sections/politics/",
  },
  {
    name: "the washington post",
    url: "https://www.washingtonpost.com/politics/",
  },
  {
    name: "the hill",
    url: "https://thehill.com/",
  },
];

const articles = [];

//scrape multiple newspapers

newspapers.forEach((newspaper) => {
  axios.get(newspaper.url).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("trump"), a:contains("Trump")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url,
        source: newspaper.name,
      });
    });
  });
});

//scrape one newspaper by param

app.get("/api", (req, res) => {
  res.json({ msg: "we on the api" });
});

app.get("/api/news", (req, res) => {
  res.json(articles);
});

app.get("/api/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaper = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  );

  axios
    .get(newspaper[0].url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("trump"), a:contains("Trump")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        specificArticles.push({
          title,
          url,
          source: newspaper[0].name,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

//error page
app.get("/*", (req, res) => {
  res.send(`<h1>RESTRICTED</h1>`);
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
