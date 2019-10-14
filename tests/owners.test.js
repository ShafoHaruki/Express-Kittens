const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const Owner = require("../models/Owner");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require('jsonwebtoken') //for what?

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);



// const contains = expect.objectContaining;

describe("owners", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
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
    const owners = [{ username: "john", password: "test12345" }];
    await Owner.create(owners);
  });

  afterEach(async () => {
    await Owner.deleteMany();
  });

  describe("[GET] /owners/secret - protected route", () => {
    it("DENIES access when owner is not authorised", async () => {
      await request(app)
        .get("/owners/secret")
        .expect(401);
    });
    it("GRANT access when owner is authorised", async () => {
      jwt.verify.mockReturnValueOnce({})

      await request(app)
        .get("/owners/billy")
        .set("Cookie", "token = some-token") //this is to set header
        .expect(200);

        expect(jwt.verify).toHaveBeenCalledTimes(1)
    });
  });

  describe("[POST] /owners", () => {
    it("adds a new owner", async () => {
      const { body: owner } = await request(app)
        .post("/owners/new")
        .send({ username: "billy", password: "arigato2019" })
        .expect(200);

      expect(owner.username).toBe("billy");
      expect(owner.password).not.toBe("arigato2019");
    });

    it("logs owner in if password is correct", async () => {
      await request(app)
        .post("/owners/login")
        .send({ username: "john", password: "test12345" })
        .expect(200);
    });

    it("does not log owner in if password is incorrect", async () => {
      await request(app)
        .post("/owners/login")
        .send({ username: "john", password: "thisIsAWrongPassword" })
        .expect(400);
    });
  });
});
