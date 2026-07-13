const request = require("supertest");
const app = require("../src/index");

describe("health & home", () => {
  test("GET / returns service metadata", async () => {
    const r = await request(app).get("/");
    expect(r.statusCode).toBe(200);
    expect(r.body.status).toBe("ok");
    expect(r.body.service).toBe("{{PROJECT_NAME}}");
  });

  test("GET /api/v1/health", async () => {
    const r = await request(app).get("/api/v1/health");
    expect(r.statusCode).toBe(200);
    expect(r.body.status).toBe("healthy");
  });
});

describe("auth flow", () => {
  const email = "test@example.com";
  const password = "secret123";

  test("register returns a token", async () => {
    const r = await request(app).post("/api/auth/register").send({ email, password });
    expect(r.statusCode).toBe(200);
    expect(r.body.token).toBeDefined();
    expect(r.body.user.email).toBe(email);
  });

  test("duplicate registration is rejected", async () => {
    const r = await request(app).post("/api/auth/register").send({ email, password });
    expect(r.statusCode).toBe(409);
  });

  test("login returns a token for valid credentials", async () => {
    const r = await request(app).post("/api/auth/login").send({ email, password });
    expect(r.statusCode).toBe(200);
    expect(r.body.token).toBeDefined();
  });

  test("login rejects bad credentials", async () => {
    const r = await request(app).post("/api/auth/login").send({ email, password: "wrong" });
    expect(r.statusCode).toBe(401);
  });

  test("protected /api/auth/me requires auth and returns the user", async () => {
    const login = await request(app).post("/api/auth/login").send({ email, password });
    const token = login.body.token;

    const noAuth = await request(app).get("/api/auth/me");
    expect(noAuth.statusCode).toBe(401);

    const ok = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(ok.statusCode).toBe(200);
    expect(ok.body.email).toBe(email);
  });
});

describe("stripe", () => {
  test("checkout without Stripe configured returns 503", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "secret123",
    });
    const r = await request(app)
      .post("/api/stripe/checkout")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ plan: "pro" });
    expect(r.statusCode).toBe(503);
  });
});
