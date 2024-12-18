# TProyecto

## Descripción

Este es un proyecto desarrollado en **Node.js**, que utiliza varias dependencias para gestionar:
- La aplicación web.
- Autenticación de usuarios.
- Generación de PDFs.
- Manejo de bases de datos.

Este documento proporciona los pasos necesarios para configurar y ejecutar el proyecto en un entorno nuevo.

> **Nota importante:** La única cuenta de administrador es:
> - **Correo**: yoshrma99@gmail.com
> - **Contraseña**: 9988

---

## Requisitos

Asegúrate de tener instalados los siguientes componentes:

- **Node.js**: v16 o superior.
- **npm**: v8 o superior (o yarn como alternativa).
- **MySQL o MariaDB**: Para la base de datos.

---

## Pasos para instalar y ejecutar el proyecto

### 1. Clonar el repositorio

Clona el repositorio desde el servicio donde está alojado (GitHub, GitLab, etc.):

```bash
git clone https://github.com/Raymundo178/Estadias.git
cd Estadias
```

### 2. Instalar dependencias

Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

### 3. Configurar las variables de entorno

Este proyecto utiliza el paquete **dotenv** para manejar las variables de entorno. 

1. Crea un archivo `.env` en la raíz del proyecto.
2. Agrega las siguientes configuraciones, ajustando según tu entorno:

```env
PORT=4000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=sistema_inventario
SESSION_SECRET=tu_secreto_para_sesiones
```

### 4. Configurar la base de datos

Para configurar la base de datos y las tablas en tu servidor MySQL, sigue estos pasos:

1. Accede a tu servidor MySQL desde la terminal:

   ```bash
   mysql -u root -p
   ```

2. Crea la base de datos y las tablas necesarias:

   - Abre el archivo `sistema_inventario.sql`.
   - Copia el contenido.
   - Pégalo y ejecútalo en el cliente MySQL.

### 5. Iniciar el servidor

Dependiendo del entorno, utiliza los siguientes comandos:

#### En desarrollo (con nodemon):
Este modo reinicia automáticamente el servidor al detectar cambios:

```bash
npm run dev
```

#### En producción:
Para ejecutar el proyecto sin recarga automática:

```bash
npm start
```

### 6. Acceder a la aplicación

Una vez que el servidor esté en funcionamiento, accede a la aplicación desde tu navegador en:

[http://localhost:4000](http://localhost:4000)

---

## Solución de problemas comunes

### Problemas de base de datos
Si tienes problemas para conectarte a la base de datos:
- Verifica que las credenciales en tu archivo `.env` sean correctas.
- Asegúrate de que el servidor MySQL esté en funcionamiento.

### Problemas con dependencias
Si encuentras errores con las dependencias, intenta ejecutar:

```bash
npm ci
```

Este comando elimina la carpeta `node_modules` y reinstala las dependencias desde cero basándose en `package-lock.json`.

---

## Información adicional

Este proyecto fue creado por **Yoshua Raymundo Moreno Arredondo** durante los periodos comprendidos del 03 de septiembre de 2024 al 06 de diciembre de 2024.

Atentamente,  
**Yoshua Raymundo Moreno Arredondo**
