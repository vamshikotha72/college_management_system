const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'college_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

// ------------------ USER REGISTER --------------------
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const hashed = bcrypt.hashSync(password, 8);
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send({ message: 'User already registered' });
            }
            return res.status(500).send(err);
        }
        res.send({ message: 'User registered successfully' });
    });
});

// ------------------ USER LOGIN --------------------
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(401).send({ message: 'Invalid credentials' });

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).send({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
        res.send({ token });
    });
});

// ------------------ GET COURSES --------------------
app.get('/courses', (req, res) => {
    db.query('SELECT * FROM courses', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// ------------------ GET STUDENT MARKS --------------------
app.get('/marks/:studentId', (req, res) => {
    const { studentId } = req.params;
    db.query(
        'SELECT c.name AS course, m.marks FROM marks m JOIN courses c ON m.course_id = c.id WHERE m.student_id = ?',
        [studentId],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
});

// ------------------ GET FEE DETAILS --------------------
app.get('/fees/:studentId', (req, res) => {
    const { studentId } = req.params;
    db.query('SELECT * FROM fees WHERE student_id = ?', [studentId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results[0]);
    });
});

app.listen(5000, () => {
    console.log('Backend server running on http://localhost:5000');
});
