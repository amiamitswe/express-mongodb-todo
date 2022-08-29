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

todoSchema.methods = {
  findActive: () => mongoose.model("Todo").find({ status: "active" }),
  findActiveCb: (cb) => mongoose.model("Todo").find({ status: "inactive" }, cb),
};

module.exports = todoSchema;
