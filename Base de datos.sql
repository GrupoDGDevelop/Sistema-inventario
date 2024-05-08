--Tabla Agencia
create table agencia(
	id_agencia serial primary key,
	nom_agencia varchar(35) not null unique
);

--Tabla Departamento
create table departamento(
	id_departamento serial primary key,
	nom_departamento varchar(35) not null unique
);

--Tabla Status
create table status(
	id_status serial primary key,
	nom_status varchar(35) not null unique
);

--Tabla Servicio
create table servicio(
	id_servicio serial primary key,
	nom_servicio varchar(35) not null unique
);

--Tabla Dispositivo
create table dispositivo(
	id_dispositivo serial primary key,
	fk_servicio integer not null,
	nom_dispositivo varchar(35) not null unique,
	FOREIGN KEY (fk_servicio) REFERENCES servicio(id_servicio)
);

--Tabla Mantenimiento
CREATE TABLE mantenimientos (
    id_mantenimiento serial PRIMARY KEY,
	fk_servicio integer not null,
    fecha_mant TIMESTAMP,
    asunto VARCHAR(100),
    observaciones VARCHAR(250),
    encargado VARCHAR(35),
    FOREIGN KEY (fk_Servicio) REFERENCES servicio(id_servicio)
);

--Tabla Usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
	fk_agencia integer not null,
    nombre_u VARCHAR(35),
    apellido_u VARCHAR(35),
    correo_u VARCHAR(50),
    password_u TEXT,
    notificaciones_u BOOLEAN,
    status_usuario BOOLEAN,
    CONSTRAINT fk_agencia FOREIGN KEY (fk_agencia) REFERENCES agencia(id_agencia)
);

--Tabla Administrador
CREATE TABLE administrador (
    id_admin SERIAL PRIMARY KEY,
	fk_agencia integer not null,
    nombre_a VARCHAR(35),
    apellido_a VARCHAR(35),
    correo_a VARCHAR(50),
    password_a TEXT,
    notificaciones_a BOOLEAN,
    status_usuario BOOLEAN,
    permisos VARCHAR(16),
    CONSTRAINT fk_agencia FOREIGN KEY (fk_agencia) REFERENCES agencia(id_agencia)
);

--Tabla Ticket
CREATE TABLE ticket (
    id_ticket SERIAL PRIMARY KEY,
	fk_status integer not null,
    fk_dispositivo integer not null,
    fk_departamento integer not null,
    fk_usuario integer not null,
    fk_administrador integer not null,
    num_ticket BIGINT,
    fecha_ini TIMESTAMP,
    fecha_fin TIMESTAMP,
    descripcion VARCHAR(250),
    evidencia BYTEA,
    observaciones_t VARCHAR(150),
    CONSTRAINT fk_status FOREIGN KEY (fk_status) REFERENCES status(id_status),
    CONSTRAINT fk_dispositivo FOREIGN KEY (fk_dispositivo) REFERENCES dispositivo(id_dispositivo),
    CONSTRAINT fk_departamento FOREIGN KEY (fk_departamento) REFERENCES departamento(id_departamento),
    CONSTRAINT fk_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_administrador FOREIGN KEY (fk_administrador) REFERENCES administrador(id_admin)
);

--Tabla Comentario
CREATE TABLE comentarios (
    id_comentario SERIAL PRIMARY KEY,
	fk_usuario integer null,
	fk_administrador integer null,
	fk_ticket integer null,
    fecha_coment TIMESTAMP,
    comentario VARCHAR(250),
	CONSTRAINT fk_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_administrador FOREIGN KEY (fk_administrador) REFERENCES administrador(id_admin),
    CONSTRAINT fk_ticket FOREIGN KEY (fk_ticket) REFERENCES ticket(id_ticket)
);