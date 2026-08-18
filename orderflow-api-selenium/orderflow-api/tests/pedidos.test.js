const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/userModel");
const productModel = require("../src/models/productModel");
const orderModel = require("../src/models/orderModel");

async function obtenerToken(correo) {
  await request(app).post("/api/auth/registro").send({ nombre: "Cliente", correo, password: "123456" });
  const login = await request(app).post("/api/auth/login").send({ correo, password: "123456" });
  return login.body.token;
}

beforeEach(() => {
  userModel.reset();
  productModel.reset();
  orderModel.reset();
});

describe("Módulo de Pedidos e Inventario", () => {
  test("HU7 + HU9 - crea un pedido y descuenta el inventario automáticamente (201)", async () => {
    const token = await obtenerToken("cliente1@test.com");
    const producto = await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "Audífonos", precio: 1500, stock: 10 });

    const res = await request(app)
      .post("/api/pedidos")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productoId: producto.body.id, cantidad: 3 }] });

    expect(res.statusCode).toBe(201);
    expect(res.body.total).toBe(4500);

    const productoActualizado = await request(app).get(`/api/productos/${producto.body.id}`);
    expect(productoActualizado.body.stock).toBe(7);
  });

  test("HU7 - rechaza el pedido si el stock es insuficiente y NO modifica el inventario (400)", async () => {
    const token = await obtenerToken("cliente2@test.com");
    const producto = await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "Webcam", precio: 2000, stock: 2 });

    const res = await request(app)
      .post("/api/pedidos")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productoId: producto.body.id, cantidad: 5 }] });

    expect(res.statusCode).toBe(400);

    const productoSinCambios = await request(app).get(`/api/productos/${producto.body.id}`);
    expect(productoSinCambios.body.stock).toBe(2);
  });

  test("HU8 - consulta el estado de un pedido propio (200)", async () => {
    const token = await obtenerToken("cliente3@test.com");
    const producto = await request(app).post("/api/productos").set("Authorization", `Bearer ${token}`).send({ nombre: "Cable", precio: 100, stock: 10 });
    const pedido = await request(app).post("/api/pedidos").set("Authorization", `Bearer ${token}`).send({ items: [{ productoId: producto.body.id, cantidad: 1 }] });

    const res = await request(app).get(`/api/pedidos/${pedido.body.id}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.estado).toBe("pendiente");
  });

  test("HU8 - un usuario no puede consultar el pedido de otro (403)", async () => {
    const tokenA = await obtenerToken("clienteA@test.com");
    const tokenB = await obtenerToken("clienteB@test.com");
    const producto = await request(app).post("/api/productos").set("Authorization", `Bearer ${tokenA}`).send({ nombre: "Cargador", precio: 300, stock: 10 });
    const pedido = await request(app).post("/api/pedidos").set("Authorization", `Bearer ${tokenA}`).send({ items: [{ productoId: producto.body.id, cantidad: 1 }] });

    const res = await request(app).get(`/api/pedidos/${pedido.body.id}`).set("Authorization", `Bearer ${tokenB}`);
    expect(res.statusCode).toBe(403);
  });
});
