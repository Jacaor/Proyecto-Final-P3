const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/userModel");

beforeEach(() => userModel.reset());

describe("Módulo de Autenticación", () => {
  test("HU1 - registra un usuario nuevo correctamente (201)", async () => {
    const res = await request(app)
      .post("/api/auth/registro")
      .send({ nombre: "Jambri", correo: "jambri@test.com", password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body.correo).toBe("jambri@test.com");
    expect(res.body.password).toBeUndefined();
  });

  test("HU1 - rechaza correo duplicado (409)", async () => {
    await request(app).post("/api/auth/registro").send({ nombre: "A", correo: "dup@test.com", password: "123456" });
    const res = await request(app).post("/api/auth/registro").send({ nombre: "B", correo: "dup@test.com", password: "654321" });
    expect(res.statusCode).toBe(409);
  });

  test("HU2 - login con credenciales válidas devuelve token (200)", async () => {
    await request(app).post("/api/auth/registro").send({ nombre: "Jambri", correo: "login@test.com", password: "123456" });
    const res = await request(app).post("/api/auth/login").send({ correo: "login@test.com", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("HU2 - login con credenciales inválidas devuelve 401", async () => {
    const res = await request(app).post("/api/auth/login").send({ correo: "noexiste@test.com", password: "x" });
    expect(res.statusCode).toBe(401);
  });

  test("HU3 - consulta de perfil requiere token (401 sin token)", async () => {
    const res = await request(app).get("/api/auth/perfil");
    expect(res.statusCode).toBe(401);
  });

  test("HU3 - consulta de perfil con token válido devuelve datos del usuario", async () => {
    await request(app).post("/api/auth/registro").send({ nombre: "Jambri", correo: "perfil@test.com", password: "123456" });
    const login = await request(app).post("/api/auth/login").send({ correo: "perfil@test.com", password: "123456" });
    const res = await request(app).get("/api/auth/perfil").set("Authorization", `Bearer ${login.body.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.correo).toBe("perfil@test.com");
  });
});
