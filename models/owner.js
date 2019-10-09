const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  salutations: {
    type: String,
    enum: ["Mr", "Mrs", "Mrs", "Mdm"]
  }
});

ownerSchema.virtual("fullName").get(function() {
  return `${this.salutations} ${this.firstName} ${this.lastName}`;
});

ownerSchema.virtual("reverseName").get(function() {
  return `${this.salutations} ${this.lastName} ${this.firstName}`;
});

const Owner = mongoose.model("Ownwer", ownerSchema);

module.exports = Owner;
