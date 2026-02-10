# Inventario

Sistema de inventario compuesto por:

- Un **frontend** en **React + TypeScript + Vite**.
- Dos **microservicios backend** en **ASP.NET Core**:
  - `ProductService` (gestión de productos)
  - `TransactionService` (gestión de transacciones)
- Persistencia en **PostgreSQL** vía **Entity Framework Core**.

## Arquitectura

- **Frontend**: `react/Inventario`
- **Backend**: `InventorySystem/InventorySystem.sln`
  - `InventorySystem/ProductService` expone `api/Product`
  - `InventorySystem/TransactionService` expone `api/Transaction`

El frontend consume los servicios en:

- `http://localhost:5299/api/Product`
- `http://localhost:5160/api/Transaction`

> Los backends tienen CORS habilitado para `http://localhost:5173`.

## Requisitos

- **.NET SDK**: el proyecto apunta a `net10.0` (requiere **.NET 10 SDK**).
- **Node.js** (recomendado LTS) y un gestor de paquetes:
  - `pnpm` (hay `pnpm-lock.yaml`) o `npm`.
- **PostgreSQL** (o una instancia remota compatible).

## Configuración

### Base de datos

Ambos servicios usan la cadena de conexión `ConnectionStrings:DefaultConnection` en:

- `InventorySystem/ProductService/appsettings.json`
- `InventorySystem/TransactionService/appsettings.json`

Ajusta `DefaultConnection` para que apunte a tu Postgres.

## Ejecución (desarrollo)

### 1) Levantar `ProductService`

Desde `InventorySystem/ProductService`:

```bash
dotnet restore
dotnet run
```

- HTTP: `http://localhost:5299`
- Swagger (en Development): `http://localhost:5299/swagger`

### 2) Levantar `TransactionService`

Desde `InventorySystem/TransactionService`:

```bash
dotnet restore
dotnet run
```

- HTTP: `http://localhost:5160`
- Swagger (en Development): `http://localhost:5160/swagger`

### 3) Levantar el frontend

Desde `react/Inventario`:

```bash
pnpm install
pnpm dev
```

Vite por defecto levanta en:

- `http://localhost:5173`

## Endpoints principales

### ProductService

Base: `http://localhost:5299/api/Product`

- `GET /` lista productos
- `GET /{id}` producto por id
- `POST /` crear producto
- `PUT /{id}` actualizar producto
- `DELETE /{id}` eliminar producto

### TransactionService

Base: `http://localhost:5160/api/Transaction`

- `GET /` lista transacciones
- `GET /{id}` transacción por id
- `GET /producto/{productId}` transacciones por producto
- `POST /` crear transacción
- `PUT /{id}` actualizar transacción
- `DELETE /{id}` eliminar transacción

## Estructura de carpetas

```text
.
├─ InventorySystem/
│  ├─ InventorySystem.sln
│  ├─ ProductService/
│  └─ TransactionService/
└─ react/
   └─ Inventario/
```
