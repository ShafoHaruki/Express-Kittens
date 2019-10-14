const mongoose = require("mongoose");

const kittySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true, //this is to set in alphabetical order
    unique: true,
    minlength: 3,
    lowercase: true
  },
  age: { type: Number, min: 0, max: 20 },
  sex: { type: String, enum: ["male", "female"] }
});

const Kitten = mongoose.model("Kitten", kittySchema);

module.exports = Kitten;
