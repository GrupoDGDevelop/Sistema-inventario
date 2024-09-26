CREATE DATABASE IF NOT EXISTS sistema_inventario;

USE sistema_inventario;

-- Tabla para Rol (Tabla primaria para los roles de los usuarios)
CREATE TABLE IF NOT EXISTS Rol (
    ID_Rol INT AUTO_INCREMENT PRIMARY KEY,
    Nom_Rol VARCHAR(50) NOT NULL
);

-- Tabla para Marca (Tabla primaria para las marcas de los productos)
CREATE TABLE IF NOT EXISTS Marca (
    ID_Marca INT AUTO_INCREMENT PRIMARY KEY,
    Nom_Marca VARCHAR(255) NOT NULL
);

-- Tabla para Modelo (Tabla primaria para los modelos de los productos)
CREATE TABLE IF NOT EXISTS Modelo (
    ID_Modelo INT AUTO_INCREMENT PRIMARY KEY,
    Nom_Modelo VARCHAR(255) NOT NULL
);

-- Tabla para Proveedor (Tabla primaria para los proveedores de los productos)
CREATE TABLE IF NOT EXISTS Proveedor (
    ID_Proveedor INT AUTO_INCREMENT PRIMARY KEY,
    Nom_Proveedor VARCHAR(255) NOT NULL
);

-- Tabla para Sistemas (Tabla primaria para los sistemas)
CREATE TABLE IF NOT EXISTS Sistemas (
    ID_Sistemas INT AUTO_INCREMENT PRIMARY KEY,
    Nom_Software VARCHAR(255) NOT NULL,
    Version VARCHAR(50),
    Licencia BOOLEAN NOT NULL DEFAULT 0 
);


-- Tabla para Usuarios (Tabla primaria para los usuarios)
CREATE TABLE IF NOT EXISTS Usuario (
    ID_Usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_U VARCHAR(100) NOT NULL,
    Apellido_U VARCHAR(100) NOT NULL,
    Correo_U VARCHAR(255) NOT NULL UNIQUE,
    Contrasena_U VARCHAR(255) NOT NULL,
    Fk_Rol INT,
    FOREIGN KEY (Fk_Rol) REFERENCES Rol(ID_Rol)
);

-- Tabla para Inventario (Tabla que depende de varias tablas primarias)
CREATE TABLE IF NOT EXISTS Inventario (
    ID_Inventario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Caracteristicas TEXT,
    No_Serie VARCHAR(100),
    Resumen TEXT,
    Precio_Total DECIMAL(10, 2),
    Fk_Marca INT,
    Fk_Modelo INT,
    Fk_Usuario INT,
    Fk_Proveedor INT,
    Fk_Sistema INT,
    FOREIGN KEY (Fk_Marca) REFERENCES Marca(ID_Marca),
    FOREIGN KEY (Fk_Modelo) REFERENCES Modelo(ID_Modelo),
    FOREIGN KEY (Fk_Usuario) REFERENCES Usuario(ID_Usuario),
    FOREIGN KEY (Fk_Proveedor) REFERENCES Proveedor(ID_Proveedor),
    FOREIGN KEY (Fk_Sistema) REFERENCES Sistemas(ID_Sistemas)
);
