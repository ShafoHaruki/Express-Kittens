const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const Kitten = require("../models/Kitten");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("kittens", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();

      mongoose.set("useNewUrlParser", true);
      mongoose.set("useFindAndModify", false);
      mongoose.set("useCreateIndex", true);
      mongoose.set("useUnifiedTopology", true);

      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const kittens = [
      { name: "fluffy", age: 5, sex: "male" },
      { name: "grandmaster", age: 19, sex: "male" },
      { name: "granny", age: 18, sex: "female" }
    ];
    await Kitten.create(kittens);
  });

  describe("[GET] /kittens", () => {
    it("get all kittens", async () => {
      const expectedKittens = [
        { name: "fluffy", age: 5, sex: "male" },
        { name: "grandmaster", age: 19, sex: "male" },
        { name: "granny", age: 18, sex: "female" }
      ];
      const { body: actualKittens } = await request(app)
        .get("/kittens")
        .expect(200);

      expectedKittens.forEach((kitten, index) => {
        expect(actualKittens[index]).toEqual(expect.objectContaining(kitten));
      });
    });
  });
});