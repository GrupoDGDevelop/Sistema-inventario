
-- Base de datos: `sistema_inventario`
--
CREATE DATABASE IF NOT EXISTS sistema_inventario;

USE sistema_inventario;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agencia`
--

CREATE TABLE `agencia` (
  `Id_Area` int(11) NOT NULL,
  `Nom_Agencia` varchar(100) DEFAULT NULL,
  `Num_Agencia` varchar(50) DEFAULT NULL,
  `Departamento` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `Id_Marca` int(11) NOT NULL,
  `Nom_Marca` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `Id_Proveedor` int(11) NOT NULL,
  `Nom_Proveedor` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `ID_Rol` int(11) NOT NULL,
  `Nom_Rol` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`ID_Rol`, `Nom_Rol`) VALUES
(1, 'Administrador'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sistemas`
--

CREATE TABLE `sistemas` (
  `ID_Sistemas` int(11) NOT NULL,
  `Nom_Software` varchar(100) DEFAULT NULL,
  `Version` varchar(20) DEFAULT NULL,
  `Licencia` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID_Producto` int(11) NOT NULL,
  `Nom_Producto` varchar(100) DEFAULT NULL,
  `Modelo` varchar(50) DEFAULT NULL,
  `Caracteristicas` text DEFAULT NULL,
  `Precio_Total` varchar(100) DEFAULT NULL,
  `Fk_Marca` int(11) DEFAULT NULL,
  `Fk_Proveedor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carta_r`
--

CREATE TABLE `carta_r` (
  `ID_Carta_R` int(11) NOT NULL,
  `Num_Serie` varchar(50) DEFAULT NULL,
  `Resumen` text DEFAULT NULL,
  `FechaU` date DEFAULT NULL,
  `Fk_Agencia` int(11) DEFAULT NULL,
  `Fk_Usuario` int(11) DEFAULT NULL,
  `Fk_Sistema` int(11) DEFAULT NULL,
  `Fk_Producto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `Nombre_U` varchar(50) DEFAULT NULL,
  `Correo_U` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `Fk_Rol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre_U`, `Correo_U`, `password`, `Fk_Rol`) VALUES
(1, 'Yoshua Raymundo', 'yoshrma99@gmail.com', '$2b$12$cyG8Ydeh5TSBJ4QVgYpKmeu2ONm9BA/ve3aYKWCREWbvemn1LwDxC', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agencia`
--
ALTER TABLE `agencia`
  ADD PRIMARY KEY (`Id_Area`);

--
-- Indices de la tabla `carta_r`
--
ALTER TABLE `carta_r`
  ADD PRIMARY KEY (`ID_Carta_R`),
  ADD KEY `Fk_Agencia` (`Fk_Agencia`),
  ADD KEY `Fk_Usuario` (`Fk_Usuario`),
  ADD KEY `Fk_Sistema` (`Fk_Sistema`),
  ADD KEY `Fk_Producto` (`Fk_Producto`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`Id_Marca`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_Producto`),
  ADD KEY `Fk_Marca` (`Fk_Marca`),
  ADD KEY `Fk_Proveedor` (`Fk_Proveedor`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`Id_Proveedor`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`ID_Rol`);

--
-- Indices de la tabla `sistemas`
--
ALTER TABLE `sistemas`
  ADD PRIMARY KEY (`ID_Sistemas`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD KEY `Fk_Rol` (`Fk_Rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agencia`
--
ALTER TABLE `agencia`
  MODIFY `Id_Area` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `carta_r`
--
ALTER TABLE `carta_r`
  MODIFY `ID_Carta_R` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `Id_Marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `Id_Proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `ID_Rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sistemas`
--
ALTER TABLE `sistemas`
  MODIFY `ID_Sistemas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carta_r`
--
ALTER TABLE `carta_r`
  ADD CONSTRAINT `carta_r_ibfk_1` FOREIGN KEY (`Fk_Agencia`) REFERENCES `agencia` (`Id_Area`),
  ADD CONSTRAINT `carta_r_ibfk_2` FOREIGN KEY (`Fk_Usuario`) REFERENCES `usuario` (`ID_Usuario`),
  ADD CONSTRAINT `carta_r_ibfk_3` FOREIGN KEY (`Fk_Sistema`) REFERENCES `sistemas` (`ID_Sistemas`),
  ADD CONSTRAINT `carta_r_ibfk_4` FOREIGN KEY (`Fk_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`Fk_Marca`) REFERENCES `marca` (`Id_Marca`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`Fk_Proveedor`) REFERENCES `proveedor` (`Id_Proveedor`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Fk_Rol`) REFERENCES `rol` (`ID_Rol`);
COMMIT;
