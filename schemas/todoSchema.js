const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// custom mongoose method (instance method)
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "active" });
  },
  findActiveCb: function (cb) {
    return mongoose.model("Todo").find({ status: "inactive" }, cb);
  },
};

// custom static method
todoSchema.statics = {
  findByJs: function () {
    return this.find({ title: /js/i });
  },
};

// custom query helper
todoSchema.query = {
  findByLanguage: function (language) {
    return this.find({ title: new RegExp(language, "i") });
    // .select({
    //   __v: 0,
    //   status: 0,
    // });
  },
};

module.exports = todoSchema;
