const controllers = require("./controllers/index.js");
const router = require("express").Router();

//router.get("/getAll", controllers.transactions.getAll);
router.get("/getReviews", controllers.Reviews.get);
