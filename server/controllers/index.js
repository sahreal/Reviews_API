const model = require("../models/index.js");

module.exports = {
  Reviews: {
    get: function(req, res) {
      model.Reviews.get((err, results) => {
        if (err) {
          console.log("Error in controller get:", err);
          res.send(500);
        } else {
          console.log("Success in controller get");
          res.send(results).status(200);
        }
      });
    }
  }
};
