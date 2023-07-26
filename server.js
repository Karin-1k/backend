const express = require('express');
const mysql = require('mysql2');
const socketio = require('socket.io');



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'huawie_notepad_project',
    port: '3306'
});
if (db.connect) {
    console.log('database connected!')
} else {
    console.error(db);
}

let io;

// inserting data route 
app.post('/api/insert', (req, res) => {
    let query = 'INSERT INTO notes SET Title=?,Content=?';
    const { id, Title, Content } = req.body;

    db.query(query, [Title, Content], (err, ok) => {
        if (err) {
            console.error(err);
        } else {
            res.send('data inserted!');
            io.emit('new-note', { id, Title, Content });


        }
    });
});


//fetching data route 
app.get('/api/fetch', (req, res) => {
    let query = 'SELECT * FROM notes';

    db.query(query, (err, ok) => {
        if (err) {
            console.error(err);
        } else {
            res.send(ok);
            io.emit('notes-updated', ok);
        }

    });
});

// fetching the gratest id 
app.get('/api/maxid', (req, res) => {
    let query = 'SELECT MAX(id) as id from notes';
    db.query(query, (err, ok) => {
        if (err) {
            console.log(err);
        } else {
            res.send(ok);
            io.emit('maxid')
        }
    });
});

// update the last note
app.put('/api/update_lastNote', (req, res) => {
    let query = 'UPDATE notes set Title=?,Content=? WHERE id=?';
    const { id, Title, Content } = req.body;
    db.query(query, [Title, Content, id], (err, ok) => {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            res.send("dataUpdated!");
            io.emit('update_lastNote', { Title, Content });
        }
    })
});
//update all ntoes 
app.put('/api/update', (req, res) => {
    let query = 'UPDATE notes set Title=?,Content=? WHERE id=?';
    const { id, Title, Content } = req.body;
    db.query(query, [Title, Content, id], (err, ok) => {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            res.send("dataUpdated!");

            io.emit('update', { id, Title, Content });
        }
    })
});

// deleting notes 
app.delete('/api/delete', (req, res) => {

    let query = 'DELETE FROM notes WHERE id=?';
    const { id } = req.body;
    db.query(query, [id], (err, ok) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send('data deleted!');
            io.emit('delete', { id });
        }
    });
});

const server = app.listen(5000, () => {
    console.log('server created!');
    io = socketio(server)

    io.on('connection', socket => {
        console.log('new user connected!');
        console.log(socket.id);
        socket.on('disconnect!', () => {
            console.log('user disconected1');
        });
    });
});
