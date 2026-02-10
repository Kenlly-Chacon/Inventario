-- Base de datos: neondb
-- Schema: public

-- Tabla: productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100),
    categoria VARCHAR(50) NOT NULL,
    imagen TEXT,
    precio NUMERIC(18, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

-- Tabla: transacciones
CREATE TABLE transacciones (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    fecha DATE,
    tipo_transaccion VARCHAR(20) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(18, 2) NOT NULL CHECK (precio_unitario >= 0),
    precio_total NUMERIC(18, 2) NOT NULL CHECK (precio_total >= 0),
    detalle VARCHAR(100),
    
    CONSTRAINT fk_producto
        FOREIGN KEY (producto_id)
        REFERENCES productos(id)
        ON DELETE RESTRICT
);

-- Índices (creados automáticamente por PRIMARY KEY)
-- productos_pkey: UNIQUE INDEX USING BTREE (id)
-- transacciones_pkey: UNIQUE INDEX USING BTREE (id)
