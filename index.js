const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

const PORT = process.env.PORT || 8080;
const host = process.env.host || 'localhost'
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

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get("/producto", (req, res) => {
  connection.query('SELECT * FROM producto', (error, results) => {
      if (error) {
          res.status(500).json({ mensaje: "Error de base de datos" });
      } else {
          res.json(results);
      }
  });
});

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

app.post("/producto/new", async (req, res) => {
  const {Id_Producto,Nombre,Categoria,Descripcion,Precio,Valoracion,Ingredientes,Costo,Minutos} = req.body;
  try {
    const result = await promisePool.query(`INSERT INTO producto VALUES ('${Id_Producto}','${Nombre}', '${Categoria}', '${Descripcion}', '${Precio}', '${Valoracion}', '${Ingredientes}', '${Costo}', '${Minutos}')`)
    res.json(result[0]).status(200);
  } catch (error) {
        res.status(500).send(error.message);
      }
    });

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