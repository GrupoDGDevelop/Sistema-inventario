--Tabla Agencia
CREATE TABLE agencia(
    id_agencia INT AUTO_INCREMENT PRIMARY KEY,
    nom_agencia VARCHAR(35) NOT NULL UNIQUE
);

--Tabla Departamento
CREATE TABLE departamento(
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nom_departamento VARCHAR(35) NOT NULL UNIQUE
);

--Tabla Status
CREATE TABLE status(
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    nom_status VARCHAR(35) NOT NULL UNIQUE
);

--Tabla Servicio
CREATE TABLE servicio(
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nom_servicio VARCHAR(35) NOT NULL UNIQUE
);

--Tabla Dispositivo
CREATE TABLE dispositivo(
    id_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    fk_servicio INT NULL,
    nom_dispositivo VARCHAR(35) NOT NULL UNIQUE,
    FOREIGN KEY (fk_servicio) REFERENCES servicio(id_servicio)
);

--Tabla Usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    fk_agencia INT NULL,
    nombre_u VARCHAR(35),
    apellido_u VARCHAR(35),
    correo_u VARCHAR(50),
    password_u TEXT,
    notificaciones_u BOOLEAN,
    status_usuario BOOLEAN,
    FOREIGN KEY (fk_agencia) REFERENCES agencia(id_agencia)
);

--Tabla Administrador
CREATE TABLE administrador (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    fk_agencia INT NULL,
    nombre_a VARCHAR(35),
    apellido_a VARCHAR(35),
    correo_a VARCHAR(50),
    password_a TEXT,
    notificaciones_a BOOLEAN,
    status_usuario BOOLEAN,
    permisos VARCHAR(20),
    FOREIGN KEY (fk_agencia) REFERENCES agencia(id_agencia)
);

--Tabla Mantenimiento
CREATE TABLE mantenimientos (
    id_mantenimiento INT AUTO_INCREMENT PRIMARY KEY,
    fk_administrador INT NULL,
    fecha_mant TIMESTAMP,
    asunto VARCHAR(100),
    observaciones VARCHAR(250),
    encargado VARCHAR(35),
    FOREIGN KEY (fk_administrador) REFERENCES administrador(id_admin)
);

--Tabla Ticket
CREATE TABLE ticket (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    fk_status INT NULL,
    fk_dispositivo INT NULL,
    fk_departamento INT NULL,
    fk_usuario INT NULL,
    fk_administrador INT NULL,
    num_ticket BIGINT,
    fecha_ini DATETIME,
    fecha_fin DATETIME,
    descripcion VARCHAR(250),
    evidencia BLOB,
    observaciones_t VARCHAR(150),
    FOREIGN KEY (fk_status) REFERENCES status(id_status),
    FOREIGN KEY (fk_dispositivo) REFERENCES dispositivo(id_dispositivo),
    FOREIGN KEY (fk_departamento) REFERENCES departamento(id_departamento),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_administrador) REFERENCES administrador(id_admin)
);

--Tabla Comentario
CREATE TABLE comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    fk_usuario INT NULL,
    fk_administrador INT NULL,
    fk_ticket INT NULL,
    fecha_coment DATETIME,
    comentario VARCHAR(250),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_administrador) REFERENCES administrador(id_admin),
    FOREIGN KEY (fk_ticket) REFERENCES ticket(id_ticket)
);
