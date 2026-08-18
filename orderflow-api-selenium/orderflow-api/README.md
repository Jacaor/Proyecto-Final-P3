# OrderFlow API

API REST con arquitectura MVC para la gestión de pedidos de un comercio electrónico. Proyecto final de Programación III — Jambriel Calderón Ortiz (2025-0915), ITLA.

## Tecnología
Node.js, Express, JWT, bcryptjs. Persistencia en memoria (fácilmente sustituible por MongoDB/Mongoose). Pruebas con Jest + Supertest. CI con GitHub Actions.

## Instalación
```bash
npm install
cp .env.example .env
npm start        # servidor en http://localhost:3000
npm test         # ejecuta la suite de pruebas con cobertura
```

## Endpoints principales

### Autenticación
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | /api/auth/registro | Registrar usuario | No |
| POST | /api/auth/login | Iniciar sesión (devuelve JWT) | No |
| GET | /api/auth/perfil | Consultar perfil propio | Sí |

### Productos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | /api/productos | Listar productos activos | No |
| GET | /api/productos/:id | Consultar un producto | No |
| POST | /api/productos | Crear producto | Sí |
| PUT | /api/productos/:id | Actualizar producto | Sí |
| DELETE | /api/productos/:id | Desactivar producto | Sí |
| GET | /api/productos/stock-bajo?umbral=5 | Reporte de stock bajo | Sí |

### Pedidos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | /api/pedidos | Crear pedido (descuenta inventario) | Sí |
| GET | /api/pedidos | Listar mis pedidos | Sí |
| GET | /api/pedidos/:id | Consultar un pedido propio | Sí |

## Ejemplo rápido (curl)
```bash
curl -X POST http://localhost:3000/api/auth/registro -H "Content-Type: application/json" \
  -d '{"nombre":"Jambri","correo":"jambri@test.com","password":"123456"}'

curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" \
  -d '{"correo":"jambri@test.com","password":"123456"}'
```

## Historias de usuario cubiertas
HU1–HU10, documentadas en el informe del proyecto final (Estrategia Scrum). Cada historia tiene al menos una prueba automatizada asociada en `/tests`.
