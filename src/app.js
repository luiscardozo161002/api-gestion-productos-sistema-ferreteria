import express from 'express';
import { conexion } from './db.js';
import { PORT } from './config.js';

const app = express();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get('/', (req, res) => {
    res.json({ message: 'API' });
});

app.get('/productos', async (req, res) => {
    try {
        const [rows, fields] = await conexion.execute('SELECT * FROM productos;');
        const obj = {};
        if (rows.length > 0) {
            obj.listaProductos = rows;
            res.json(obj);
        } else {
            res.json({ message: 'No hay registros' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/productos/add', async (req, res) => {
    const { nombre, descripcion, numero_serie, existencia, id_categoria, id_marca, estado} = req.body;

    try {
        const [result] = await conexion.execute('INSERT INTO usuarios (nombre, descripcion, numero_serie, existencia, id_categoria, id_marca, estado) VALUES (?, ?, ?, ?, ?, ?, ?);', [nombre, descripcion, numero_serie, existencia, id_categoria, id_marca, estado]);
        res.json(`Se insertó correctamente el producto con ID: ${result.insertId}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.put('/productos/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, numero_serie, existencia, id_categoria, id_marca, estado} = req.body;

    try {
        const [result] = await conexion.execute('UPDATE productos SET nombre=?, descripcion=?, numero_serie=?, existencia=?, id_categoria=?, id_marca=?, estado=? WHERE id_producto=?;', [nombre, descripcion, numero_serie, existencia, id_categoria, id_marca, estado, id]);
        res.json(`Se actualizó correctamente el producto`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

app.delete('/productos/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await conexion.execute('DELETE FROM productos WHERE id_producto=?;', [id]);
        res.json(`Se eliminó correctamente el producto`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});
