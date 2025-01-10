# TProyecto

![ezgif-3-0c50b72c4a](https://github.com/user-attachments/assets/624fefc5-13b5-4cee-8a65-c1235ff443ec)


## Descripción

---

Este es un proyecto desarrollado en **Node.js**, que utiliza varias dependencias para gestionar:
- La aplicación web.
- Autenticación de usuarios.
- Generación de PDFs.
- Manejo de bases de datos.
- Almacenamiento de archivos PDF.

Este documento proporciona los pasos necesarios para configurar y ejecutar el proyecto en un entorno nuevo.

> **Nota importante:** La única cuenta de administrador es:
> - **Correo**: yoshrma99@gmail.com
> - **Contraseña**: 9988



Diseño del proyecto: Está basado en el modelo vista-controlador, no obstante, aquí no se cuentan con modelos.
Las partes que conforman el proyecto con las siguientes:
- **Vistas**: Son las interfaces de usuario, están en formato handlebars para permitir renderizar información que se mande desd el backend
- **API**: Manda a llamar las rutas, hecha en Express.
- **Ruta**: Son archivos que contienen las direcciones a las que el API puede mandar a llamar, estos archivos mandan a llamar los controladores.
- **Controladores**: Estos archivos contienen las funciones para hacer las peticiones a la base de datos ya sea de Mongodb o MySQL, o para renderizar las vistas.

![image](https://github.com/user-attachments/assets/0d52fbde-430e-4104-9229-047065fd6344)


---

## Requisitos

Asegúrate de tener instalados los siguientes componentes:

- **Node.js**: v16 o superior.
- **npm**: v8 o superior (o yarn como alternativa).
- **MySQL o MariaDB**: Para la base de datos.
- **MongoDB** v8.0.4: Para la base de datos de productos y responsivas.

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

#### Configuración de MySQL

Para configurar la base de datos y las tablas en tu servidor MySQL, sigue estos pasos:

1. Accede a tu servidor MySQL desde la terminal:

   ```bash
   mysql -u root -p
   ```

2. Crea la base de datos y las tablas necesarias:

   - Abre el archivo `sistema_inventario.sql`.
   - Copia el contenido.
   - Pégalo y ejecútalo en el cliente MySQL.

En este proyecto se usó PhpMyAdmin con XAMPP para administrar la base de datos, puede importar la base de datos usando PhpMyAdmin y el archivo de este repositorio.

#### Configuración de MongoDB

Para configurar MongoDB y las colecciones necesarias, sigue estos pasos:

1. Instala MongoDB versión 8.0.4. Puedes descargarlo desde la [página oficial de MongoDB](https://www.mongodb.com/try/download/community) o utilizar un administrador de paquetes como `apt` (Linux) o `choco` (Windows).

2. Inicia el servidor MongoDB. Generalmente, esto puede hacerse con el siguiente comando desde la terminal:

   ```bash
   mongod
   ```

   Asegúrate de que esté configurado para escuchar en `localhost` o en la configuración predeterminada.

3. Conéctate al servidor MongoDB desde tu cliente preferido, como MongoCompass. Una vez conectado, realiza las siguientes configuraciones:

   - **Crear la base de datos**:
     1. En MongoCompass, selecciona la opción para crear una nueva base de datos.
     2. Nombra la base de datos como `inventario_productos`.

   - **Crear las colecciones**:
     1. Dentro de la base de datos `inventario_productos`, crea las siguientes colecciones:
        - `cartas_responsivas`
        - `productos`
        - `tipos_productos`

![image](https://github.com/user-attachments/assets/794c7c56-ebcf-4720-9be6-31d531447f75)


Con esto, la configuración de MongoDB estará completa y lista para su uso.



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

**Nota**: El sistema funciona dentro de la red local, lo que permite que otros dispositivos en la misma red puedan acceder a la aplicación.

Para acceder a la aplicación desde otro dispositivo:

1. Obtén la dirección IP del servidor donde se está ejecutando la aplicación. Ejecuta el siguiente comando en la terminal del servidor:
 ```bash
   ipconfig
 ```
Busca la dirección IPv4 asociada a la conexión de red activa.
En el dispositivo cliente, abre un navegador web y escribe la dirección IP del servidor seguida del puerto donde se ejecuta la aplicación. Por ejemplo:

arduino
Copiar código

 ```bash
http://<IP_DEL_SERVIDOR>:4000
 ```

Sustituye <IP_DEL_SERVIDOR> por la dirección IP obtenida en el paso anterior.
Con estos pasos, podrás acceder a la aplicación desde cualquier dispositivo conectado a la misma red local.

![image](https://github.com/user-attachments/assets/8352a848-9eab-4fc9-a70c-ed91bf244951)

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

## Estado actual y cambios a futuro

El estado actual de proyecto se agregaron las siguientes funcionalidades funcionalidades:

- Soporte con base de datos mongodb.
- Carga de características de productos de forma dinámica.
- Un nuevo ID para las cartas responsivas.
- Estados de las cartas.

## Cambios a futuro

- Modificación y refactorización de código: Existen remanentes de código sobre consultas SQL del backend que no son necesarias y en algunos casos redundancias.
- Modificar la estructuraa de la base de datos SQL: Debido a que se modifico la forma en la que se almacenan los productos y responsivas en MongoDB, tablas de la base de datos de MySQL ya no son necesarias.
- Departamentos y sucursales: Se debe modificar el sistema para que cada agencia, tenga relacionaados varios departamentos, los departamentos varios empleados.
- Facturas en productos: Se debe agregar que los productos almacenen una factura.
- Actualización de productos relacionados a cartas repsonsivas: Los productos que estén relacionados con una carta responsiva no deben ser seleccionables cuando se cree una nueva carta responsiva.

## Información adicional

Este proyecto fue inicialmente creado por **Yoshua Raymundo Moreno Arredondo** durante los periodos comprendidos del 03 de septiembre de 2024 al 06 de diciembre de 2024.

Atentamente,  
**Yoshua Raymundo Moreno Arredondo**

