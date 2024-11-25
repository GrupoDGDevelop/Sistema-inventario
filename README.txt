# TProyecto

## Descripción
Este es un proyecto Node.js que utiliza varias dependencias para gestionar la aplicación web, autenticación de usuarios, generación de PDFs y manejo de bases de datos. Este README proporciona los pasos necesarios para configurar el proyecto en un entorno nuevo.

> **Nota importante:** La única cuenta de administrador es:
> - **Correo**: yoshrma99@gmail.com
> - **Contraseña**: 9988

## Requisitos
- **Node.js**: v16 o superior
- **npm**: v8 o superior (o yarn si prefieres usarlo)
- **MySQL o MariaDB**: Para la base de datos

## Pasos para instalar y ejecutar el proyecto

### 1. Clonar el repositorio

Primero, clona el repositorio desde el servicio donde está alojado (GitHub, GitLab, etc.).

```bash
git clone https://github.com/Raymundo178/Estadias.git
cd tproyecto


### 2. Instalar dependencias

El proyecto utiliza npm para la gestión de dependencias. Para instalar todas las dependencias necesarias, ejecuta:

npm install

### 3. Configurar las variables de entorno

Este proyecto utiliza el paquete dotenv para manejar variables de entorno. Debes crear un archivo .env en la raíz del proyecto con las siguientes variables (ajusta según tu configuración):

PORT=4000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=sistema_inventario
SESSION_SECRET=tu_secreto_para_sesiones

### 4. Configurar la base de datos

Para configurar la base de datos y las tablas en tu servidor MySQL, sigue estos pasos:

1. Accede a tu servidor MySQL:

 2. Abre la terminal o línea de comandos.
Conéctate a MySQL con el siguiente comando (asegurándote de que tu contraseña esté configurada correctamente):

mysql -u root -p

Asegúrate de estar en el entorno correcto ejecutando

Copia todo el contenido de tu archivo sistemas_inventario.sql.

Pega este contenido en el cliente de MySQL y ejecútalo.

### 5.Iniciar el servidor
En desarrollo (con nodemon):
Para ejecutar el proyecto en modo de desarrollo, que reiniciará el servidor automáticamente cuando haya cambios en los archivos, usa:


npm run dev

En producción:
Si deseas ejecutar el proyecto en producción, utiliza:

npm start

Este comando ejecutará el proyecto sin la recarga automática, utilizando node directamente.

### 6. Accede a la aplicación

Una vez que el servidor esté en marcha, podrás acceder a la aplicación a través de tu navegador, en la siguiente dirección:

http://localhost:4000

### 7. Problemas comunes
Problema de base de datos: Si tienes problemas para conectarte a la base de datos, asegúrate de que las credenciales en tu archivo .env sean correctas y que el servidor MySQL esté corriendo.

Problemas con dependencias: Si tienes algún problema con las dependencias, intenta ejecutar:

npm ci

Este comando eliminará la carpeta node_modules y reinstalará todas las dependencias desde cero según el archivo package-lock.json.

¡Con esto, tu equipo debería estar listo para trabajar en el proyecto!

BUENA SUERTE.

Attentamente:Yoshua Raymundo Moreno Arredondo 