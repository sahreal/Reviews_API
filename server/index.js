const express = require("express");
const Parser = require("body-parser");
const app = express();
const port = 3000;
const { ReviewList, Char, Meta, PhotoList } = require("../db/index.js");
//const router = require("./routes.js");

app.use(Parser.json());
// app.use("/Reviews", router);

//***************** GET *****************************
app.get("/reviews/:product_id/list", async (req, res) => {
  try {
    var review = await ReviewList.find({})
      .limit(100)
      .exec();
    for (let item of review) {
      var photo = await PhotoList.find({ review_id: item.id })
        .limit(100)
        .exec();
      item._doc.photo = photo;
    }
    res.send(review);
  } catch (err) {
    console.log(err, "ERROR");
  }
});

app.get("/reviews/:product_id/meta", async (req, res) => {
  try {
    let results = {
      product_id: req.params.product_id,
      ratings: {},
      recommended: {},
      characteristics: {}
    };

    var rating = await ReviewList.find({
      product_id: Number(req.params.product_id)
    });

    const newRating = rating.reduce((acc, sum) => {
      if (acc[sum.rating]) {
        acc[sum.rating]++;
      } else {
        acc[sum.rating] = 1;
      }
      return acc;
    }, {});

    results.ratings = newRating;

    var recommend = await ReviewList.find({
      product_id: Number(req.params.product_id)
    }).exec();

    const newRecommend = recommend.reduce((acc, sum) => {
      if (acc[sum.recommend]) {
        acc[sum.recommend]++;
      } else {
        acc[sum.recommend] = 1;
      }
      return acc;
    }, {});

    results.recommended = newRecommend;

    var characteristics = await Meta.find({
      product_id: Number(req.params.product_id)
    }).exec();

    let obj = {};
    for (let item of characteristics) {
      if (obj[item.name] === undefined) {
        obj[item.name] = {
          value: item.value,
          id: item.id
        };
      }
    }
    results.characteristics = obj;

    res.send(results);
  } catch (err) {
    console.log(err, "ERROR");
  }
});

//***************** POST *****************************

app.post("/reviews/:product_id", async (req, res) => {
  let result = req.body;
  try {
    await ReviewList.create({
      review_id: result.review_id,
      rating: result.rating,
      summary: result.summary,
      recommend: result.recommend,
      response: result.response,
      body: result.body,
      reviewer_name: result.reviewer_name,
      reviewer_email: result.reviewer_email
    });

    await PhotoList.create({
      photos: result.photos
    });

    await Char.create({
      characteristics: result.characteristics
    });
    res.sendStatus(201);
  } catch (err) {
    console.log(err, "POST REQUEST ERROR");
  }
});

//***************** PUT *****************************

app.put("/reviews/helpful/:review_id", async (req, res) => {
  let result = req.body;
  try {
    console.log("result", result);
    await ReviewList.findOneAndUpdate(
      {
        id: req.params.review_id
      },
      { helpfulness: result.helpfulness }
    );
    res.sendStatus(204);
  } catch (err) {
    console.log(err, "HELPFUL PUT REQUEST ERROR");
  }
});

app.put("/reviews/report/:review_id", async (req, res) => {
  let result = req.body;
  try {
    await ReviewList.updateOne({
      id: req.params.review_id,
      reported: result.reported
    });
    res.sendStatus(204);
  } catch (err) {
    console.log(err, "HELPFUL PUT REQUEST ERROR");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
