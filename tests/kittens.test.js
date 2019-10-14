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

  afterEach(async () => {
    await Kitten.deleteMany();
  });

  describe("[GET] /kittens", () => {
    it("gets all kittens", async () => {
      const expectedKittens = [
        { name: "fluffy", age: 5, sex: "male" },
        { name: "grandmaster", age: 19, sex: "male" },
        { name: "granny", age: 18, sex: "female" }
      ];

      return request(app)
        .get("/kittens")
        .expect(200)
        .expect(data => {
          expectedKittens.forEach((kitten, index) => {
            expect(data.body[index]).toEqual(expect.objectContaining(kitten));
          });
        });
    });
    // it("Gets a certain kitten", async () => {
    //   return request(app)
    //     .get("/kittens/fluffy")
    //     .expect(200)
    //     .then(response => {
    //       expect(response.body).toMatchObject([
    //         {
    //           __v: 0,
    //           _id: "5d9eb40790a5fe6690ee4c5f",
    //           age: 5,
    //           name: "fluffy",
    //           sex: "male"
    //         }
    //       ]);
    //     });
    // });
  });

  describe("[POST] /kittens/new", () => {
    it("adds a new kitten", async () => {
      const newKitten = { name: "gangster", age: 8, sex: "male" };
      return request(app)
        .post("/kittens/new")
        .send(newKitten)
        .expect(200)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toMatchObject({
            name: "gangster",
            age: 8,
            sex: "male"
          });
        });
    });
  });
});
