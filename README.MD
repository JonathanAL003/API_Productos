# API de Productos

Esta API proporciona operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para gestionar productos. Utiliza Express.js y MySQL como base de datos.

## Configuración

1. **Instalación de dependencias:**
   ```bash
   npm install

1. **Configuración de la base de datos:**
Asegúrate de tener un servidor MySQL en ejecución. Actualiza la configuración de la base de datos en connection.js.

2. **Ejecución del servidor:**
```bash
node index.js
```

3. **Acceso a la documentación Swagger:**
Abre tu navegador y visita http://localhost:8080/api-docs para acceder a la documentación Swagger.

**Estructura del Proyecto**
index.js: Archivo principal que inicia el servidor.
connection.js: Configuración de la conexión a la base de datos.
routes/productoRoutes.js: Definición de las rutas relacionadas con productos.
controllers/productoController.js: Lógica del controlador para operaciones CRUD.
services/productoService.js: Lógica del servicio que interactúa con la base de datos.

**Endpoints**
GET /producto: Obtiene todos los productos.
GET /producto/{id}: Obtiene un producto por su ID.
POST /producto/new: Crea un nuevo producto.
PUT /producto/{id}: Actualiza un producto por su ID.
DELETE /producto/{id}: Elimina un producto por su ID.


**Documentación Swagger**
La documentación Swagger se encuentra en http://localhost:8080/api-docs. Aquí puedes explorar y probar los diferentes endpoints de la API.