const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/userModel");
const productModel = require("../src/models/productModel");

async function obtenerToken() {
  await request(app).post("/api/auth/registro").send({ nombre: "Admin", correo: "admin@test.com", password: "123456" });
  const login = await request(app).post("/api/auth/login").send({ correo: "admin@test.com", password: "123456" });
  return login.body.token;
}

beforeEach(() => {
  userModel.reset();
  productModel.reset();
});

describe("Módulo de Productos", () => {
  test("HU4 - crea un producto correctamente (201)", async () => {
    const token = await obtenerToken();
    const res = await request(app)
      .post("/api/productos")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Mouse", precio: 500, stock: 10 });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("Mouse");
  });

  test("HU4 - rechaza producto sin campos obligatorios (400)", async () => {
    const token = await obtenerToken();
    const res = await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "Sin precio" });
    expect(res.statusCode).toBe(400);
  });

  test("HU5 - lista solo productos activos", async () => {
    const token = await obtenerToken();
    await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "Teclado", precio: 800, stock: 5 });
    const res = await request(app).get("/api/productos");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("HU5 - consulta por id inexistente devuelve 404", async () => {
    const res = await request(app).get("/api/productos/999");
    expect(res.statusCode).toBe(404);
  });

  test("HU6 - actualiza y elimina (desactiva) un producto", async () => {
    const token = await obtenerToken();
    const creado = await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "Monitor", precio: 5000, stock: 3 });

    const upd = await request(app).put(`/api/productos/${creado.body.id}`).set("Authorization", `Bearer ${token}`).send({ precio: 4500 });
    expect(upd.statusCode).toBe(200);
    expect(upd.body.precio).toBe(4500);

    const del = await request(app).delete(`/api/productos/${creado.body.id}`).set("Authorization", `Bearer ${token}`);
    expect(del.statusCode).toBe(200);

    const lista = await request(app).get("/api/productos");
    expect(lista.body.find((p) => p.id === creado.body.id)).toBeUndefined();
  });

  test("HU10 - reporte de stock bajo devuelve productos ordenados ascendente", async () => {
    const token = await obtenerToken();
    await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "A", precio: 100, stock: 4 });
    await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "B", precio: 100, stock: 1 });
    await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "C", precio: 100, stock: 20 });

    const res = await request(app).get("/api/productos/stock-bajo?umbral=5").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.map((p) => p.nombre)).toEqual(["B", "A"]);
  });
});
