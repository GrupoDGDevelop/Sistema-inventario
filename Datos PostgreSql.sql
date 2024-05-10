-- Insertar datos en la tabla Agencia
INSERT INTO agencia (nom_agencia) VALUES ('volkswagen');

-- Insertar datos en la tabla Departamento
INSERT INTO departamento (nom_departamento) VALUES ('Torre Control');

-- Insertar datos en la tabla Status
INSERT INTO status (nom_status) VALUES ('Activo');

-- Insertar datos en la tabla Servicio
INSERT INTO servicio (nom_servicio) VALUES ('Revicion');

-- Insertar datos en la tabla Dispositivo
INSERT INTO dispositivo (fk_servicio, nom_dispositivo) VALUES (1, 'Laptop');

-- Insertar datos en la tabla Mantenimiento
INSERT INTO mantenimientos (fk_servicio, fecha_mant, asunto, observaciones, encargado) 
VALUES (1, '2024-05-11 08:10:00', 'Falla Sistema OP', 'Cambio de Disco duro necesario', 'Emmanuel');

-- Insertar datos en la tabla Usuario
INSERT INTO usuario (fk_agencia, nombre_u, apellido_u, correo_u, password_u, notificaciones_u, status_usuario) 
VALUES (1, 'Luis', 'Osbaldo', 'luis0@usuario.com', '1234', true, true);

-- Insertar datos en la tabla Administrador
INSERT INTO administrador (fk_agencia, nombre_a, apellido_a, correo_a, password_a, notificaciones_a, status_usuario, permisos) 
VALUES (1, 'Daniel', 'Flores', 'Dani@administrador.com', '1234', true, true, '0001-0111-1101-1111');

-- Insertar datos en la tabla Ticket
INSERT INTO ticket (fk_status, fk_dispositivo, fk_departamento, fk_usuario, fk_administrador, num_ticket, fecha_ini, fecha_fin, descripcion, evidencia, observaciones_t) 
VALUES (1, 1, 1, 1, 1, 12345, '2024-08-21 08:10:00', '2024-10-12 10:30:00', 'Un niño volo sobre mi y volo un carro con su rasho lazer', NULL, 'Lo anterior es un chiste');

-- Insertar datos en la tabla Comentario
INSERT INTO comentarios (fk_usuario, fk_administrador, fk_ticket, fecha_coment, comentario) 
VALUES (1, 1, 1, '2024-05-01 08:00:00', 'Si, fue un buen chiste');
