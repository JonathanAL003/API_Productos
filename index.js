const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const swaggerJsdoc = require('swagger-jsdoc'); 
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT || 8080;
const host = process.env.MYSQLHOST || 'localhost'
const user = process.env.DB_USER || 'root'
const password = process.env.MYSQLPASSWORD || ''
const database = process.env.MYSQL_DATABASE || 'bdweb'
const dbport = process.env.MYSQLPORT || 3306

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
  port: dbport,
});

const pool = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
  port: dbport,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, 
  idleTimeout: 60000, 
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API de Productos', 
      version: '1.0.2',
      description: 'API para gestionar productos',
    },
  },
  apis: [__filename],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


/**
 * @swagger
 * /:
 *   get:
 *     description: Retorna un saludo de bienvenida
 *     responses:
 *       200:
 *         description: 'Hello, world!'
 */

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

/**
 * @swagger
 * /producto:
 *   get:
 *     description: Retorna todos los productos
 *     responses:
 *       200:
 *         description: Datos de todos los productos
 */

app.get("/producto", (req, res) => {
  connection.query('SELECT * FROM producto', (error, results) => {
      if (error) {
          res.status(500).json({ mensaje: "Error de base de datos" });
      } else {
          res.json(results);
      }
  });
});

/**
 * @swagger
 * /producto/{id}:
 *   get:
 *     description: Retorna un producto por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Datos del producto
 *       404:
 *         description: Producto no encontrado
 */

app.get("/producto/:id", (req, res) => {
  const productId = req.params.id;
  console.log(req.params.id);
  connection.query('SELECT * FROM producto WHERE Id_Producto = ?', [productId], (error, results) => {
      if (error) {
          res.status(500).json({ mensaje: "Error de base de datos" });
      } else {
          if (results.length === 0) {
              res.status(404).json({ mensaje: "No existe el producto" });
          } else {
              res.json(results);
          }
      }
  });
});

/**
 * @swagger
 * /producto/new:
 *   post:
 *     description: Crea un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id_Producto:
 *                 type: string
 *               Nombre:
 *                 type: string
 *               Categoria:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *               Precio:
 *                 type: string
 *               Valoracion:
 *                 type: string
 *               Ingredientes:
 *                 type: string
 *               Costo:
 *                 type: string
 *               Minutos:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto creado con éxito
 *       500:
 *         description: Error del servidor
 */

app.post("/producto/new", async (req, res) => {
  const {Id_Producto,Nombre,Categoria,Descripcion,Precio,Valoracion,Ingredientes,Costo,Minutos} = req.body;
  try {
    const result = await promisePool.query(`INSERT INTO producto VALUES ('${Id_Producto}','${Nombre}', '${Categoria}', '${Descripcion}', '${Precio}', '${Valoracion}', '${Ingredientes}', '${Costo}', '${Minutos}')`)
    res.json(result[0]).status(200);
  } catch (error) {
        res.status(500).send(error.message);
      }
    });

/**
 * @swagger
 * /producto/{id}:
 *   put:
 *     description: Actualiza un producto por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // ... (propiedades a actualizar)
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *       500:
 *         description: Error del servidor
 */
    
app.put("/producto/:id", async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;
      
    try {
      let sql = "UPDATE producto SET ";
      const values = [];
      for (const key in updateFields) {
        if (updateFields.hasOwnProperty(key)) {
          sql += `${key} = ?, `;
          values.push(updateFields[key]);
        }
      }
      sql = sql.slice(0, -2);
      sql += ` WHERE Id_Producto = ?`;
      values.push(id);
          
      const result = await promisePool.query(sql, values);
      res.json(result[0]).status(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
     
/**
 * @swagger
 * /producto/{id}:
 *   delete:
 *     description: Elimina un producto por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */  

app.delete("/producto/:id", (req, res) => {
    const productId = req.params.id;
    console.log(req.params.id);
    connection.query('DELETE FROM producto WHERE Id_Producto = ?', [productId], (error, results) => {
        if (error) {
            res.status(500).json({ mensaje: "Error de base de datos" });
        } else {
            if (results.length === 0) {
                res.status(404).json({ mensaje: "No existe el producto" });
            } else {
                res.json({mensaje : "Registro eliminado con exito"});
            }
        }
    });
  });

app.listen(PORT,(req,res)=>{
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});