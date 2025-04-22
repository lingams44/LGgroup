const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
//const ngrok = require('ngrok');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your password',
    database: 'miniproject'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('MySQL connected...');
});

// Default route to serve the frontend's index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});
// Student registration
app.post('/register/student', (req, res) => {
    const { student_id, full_name, email, gender, date_of_birth, department, std_year, institute, address, password } = req.body;

    if (!student_id || !full_name || !email || !gender || !date_of_birth || !department || !std_year || !institute || !address || !password) {
        return res.status(400).send('All fields are required.');
    }

    const sql = 'INSERT INTO students (student_id, full_name, email, gender, date_of_birth, department, std_year, institute_name, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [student_id, full_name, email, gender, date_of_birth, department, std_year, institute, address, password], (err, result) => {
        if (err) {
            console.error('Error registering student:', err);
            return res.status(500).send('Error registering student');
        }
        res.status(201).send('Student registered successfully');
    });
});

// Staff registration
app.post('/register/staff', (req, res) => {
    const { staff_id, full_name, email, gender, age, department, address, password } = req.body;

    if (!staff_id || !full_name || !email || !gender || !age || !department || !address || !password) {
        return res.status(400).send('All fields are required.');
    }

    const sql = 'INSERT INTO staff (staff_id, full_name, email, gender, age, department, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [staff_id, full_name, email, gender, age, department, address, password], (err, result) => {
        if (err) {
            console.error('Error registering staff:', err);
            return res.status(500).send('Error registering staff');
        }
        res.status(201).send('Staff registered successfully');
    });
});

// Login
app.post('/login', (req, res) => {
    const { user_id, password, role } = req.body;

    let sql;
    if (role === 'student') {
        sql = 'SELECT * FROM students WHERE student_id = ? AND password = ?';
    } else if (role === 'staff') {
        sql = 'SELECT * FROM staff WHERE staff_id = ? AND password = ?';
    } else if (role === 'admin') {
        sql = 'SELECT * FROM admin WHERE admin_id = ? AND password = ?';
    } else {
        return res.status(400).send('Invalid role');
    }

    db.query(sql, [user_id, password], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error fetching user');
        }
        if (results.length === 0) {
            return res.status(401).send({ success: false, message: 'Invalid credentials' });
        }

        const user = results[0];
        res.json({ success: true, user });
    });
});

// Get staff profile
app.get('/api/staff/:staffId', (req, res) => {
    const { staffId } = req.params;
    const sql = 'SELECT * FROM staff WHERE staff_id = ?';
    db.query(sql, [staffId], (err, result) => {
        if (err) return res.status(500).send('Error fetching staff profile');
        if (result.length === 0) return res.status(404).send('Staff not found');
        res.json(result[0]);
    });
});

// Get student profile
app.get('/api/student/:studentId', (req, res) => {
    const { studentId } = req.params;
    const sql = 'SELECT * FROM students WHERE student_id = ?';
    db.query(sql, [studentId], (err, result) => {
        if (err) return res.status(500).send('Error fetching student profile');
        if (result.length === 0) return res.status(404).send('Student not found');
        res.json(result[0]);
    });
});

// Universal data fetch
/*app.get('/api/:table', (req, res) => {
    const { table } = req.params;
    const sql = `SELECT * FROM ${table}`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});*/

// Delete student or staff
app.delete('/api/:role/:id', (req, res) => {
    const { role, id } = req.params;
    let idField;
    if (role === 'student') {
        idField = 'student_id';
    } else if (role === 'staff') {
        idField = 'staff_id';
    } else {
        return res.status(400).send({ message: 'Invalid role' });
    }

    const sql = `DELETE FROM ${role} WHERE ${idField} = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'No record found with the given ID' });
        }
        res.send({ message: 'Deleted successfully!' });
    });
});

// Create exam questions (staff only)
app.post('/api/exam-questions', (req, res) => {
    const {
        exam_title, question_type, created_by,
        question_text, option1, option2, option3, option4,
        correct_answer, full_answer, partial_answer
    } = req.body;

    // Check if staff is valid
    db.query('SELECT * FROM staff WHERE staff_id = ?', [created_by], (err, staffResult) => {
        if (err) {
            console.error("Error verifying staff:", err);
            return res.status(500).send("Internal server error.");
        }

        if (staffResult.length === 0) {
            return res.status(403).send("Only staff can create questions.");
        }

        const sql = `
            INSERT INTO exam_questions 
            (exam_title, question_type, created_by, question_text, 
             option1, option2, option3, option4, 
             correct_answer, full_answer, partial_answer) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [
            exam_title, question_type, created_by, question_text,
            option1, option2, option3, option4,
            correct_answer, full_answer, partial_answer
        ], (err, result) => {
            if (err) {
                console.error("Error inserting question:", err);
                return res.status(500).send("Failed to insert question.");
            }
            res.status(201).send("Question added successfully!");
        });
    });
});

// Create exam schedule (staff only)
app.post('/api/exam-schedule', (req, res) => {
    const {
        exam_id, staff_id, exam_name,
        exam_date, exam_time, duration,
        total_marks, department
    } = req.body;

    if (!exam_id || !staff_id || !exam_name || !exam_date || !exam_time || !duration || !total_marks || !department) {
        return res.status(400).send('All fields are required.');
    }

    // Validate staff
    db.query('SELECT * FROM staff WHERE staff_id = ?', [staff_id], (err, staffResult) => {
        if (err) {
            console.error('Error checking staff:', err);
            return res.status(500).send('Internal server error.');
        }

        if (staffResult.length === 0) {
            return res.status(403).send('Invalid staff ID. Only staff can create schedules.');
        }

        const sql = `INSERT INTO exam_schedule 
            (exam_id, staff_id, exam_name, exam_date, exam_time, duration, total_marks, department)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [exam_id, staff_id, exam_name, exam_date, exam_time, duration, total_marks, department], (err, result) => {
            if (err) {
                console.error('Error creating schedule:', err);
                return res.status(500).send('Schedule creation failed.');
            }
            res.status(201).send('Schedule created successfully.');
        });
    });
});

// Get exam schedule by ID
app.get('/api/exam-schedule/:examId', (req, res) => {
    const { examId } = req.params;

    const sql = 'SELECT * FROM exam_schedule WHERE exam_id = ?';
    db.query(sql, [examId], (err, result) => {
        if (err) {
            console.error('Error fetching schedule:', err);
            return res.status(500).send('Error fetching schedule');
        }
        if (result.length === 0) return res.status(404).send('No schedule found');
        res.json(result[0]);
    });
});

// Fetch MCQ questions for an exam
app.get('/api/exam-questions/:exam_title', (req, res) => {
    const { exam_title} = req.params;
    const sql = 'SELECT * FROM exam_questions WHERE exam_title = ? AND question_type = "mcq"';
    db.query(sql, [exam_title], (err, results) => {
        if (err) {
            console.error('Error fetching questions:', err);
            return res.status(500).send('Error fetching questions');
        }
        res.json(results);
    });
});

// Submit MCQ answers and calculate score
app.post('/api/submit-exam', (req, res) => {
    const { student_id, exam_title, exam_role, score } = req.body;

    // Store result in database
    const resultSql = 'INSERT INTO results (student_id, exam_title, exam_role, score) VALUES (?, ?, ?, ?)';
    db.query(resultSql, [student_id, exam_title, exam_role, score], (err, result) => {
        if (err) {
            console.error('Error storing result:', err);
            return res.status(500).send('Error storing result');
        }
        res.json({ score });
    });
});

app.patch('/api/publish-results', (req, res) => {
    const sql = 'UPDATE results SET publish = TRUE WHERE publish = FALSE';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error updating results:', err);
            return res.status(500).send('Error updating results.');
        }

        res.send('Results successfully published.');
    });
});

// Fetch all student results
app.get('/api/results', (req, res) => {
    const sql = `
        SELECT r.result_id, r.student_id, s.full_name AS student_name, r.exam_title, r.exam_role, r.score, r.publish, r.created_at
        FROM results r
        JOIN students s ON r.student_id = s.student_id
        ORDER BY r.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching results:', err);
            return res.status(500).send('Error fetching results');
        }
        res.json(results);
    });
});

// Fetch student result based on student_id and date_of_birth
app.post('/api/student-result', (req, res) => {
    const { student_id, date_of_birth } = req.body;

    if (!student_id || !date_of_birth) {
        return res.status(400).send('Student ID and Date of Birth are required.');
    }

    const sql = `
        SELECT s.full_name, r.exam_title, r.exam_role, r.score, r.publish, r.created_at
        FROM results r
        JOIN students s ON r.student_id = s.student_id
        WHERE s.student_id = ? AND s.date_of_birth = ?
    `;

    db.query(sql, [student_id, date_of_birth], (err, results) => {
        if (err) {
            console.error('Error fetching student result:', err);
            return res.status(500).send('Error fetching student result.');
        }

        if (results.length === 0) {
            return res.status(404).send('Invalid Student ID or Date of Birth.');
        }

        const fullName = results[0].full_name; // Extract full_name from the first result
        const formattedResults = results.map(result => ({
            exam_title: result.exam_title,
            exam_role: result.exam_role,
            score: result.score,
            publish: result.publish,
            created_at: result.created_at,
        }));

        res.json({ full_name: fullName, results: formattedResults });
    });
});

// Fetch all exam schedules
app.get('/api/exam-schedule', (req, res) => {
    const sql = `
        SELECT schedule_id, exam_name, exam_date, exam_time, duration, total_marks, department
        FROM exam_schedule
        ORDER BY exam_date ASC, exam_time ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching exam schedule:', err);
            return res.status(500).send('Error fetching exam schedule.');
        }

        res.json(results);
    });
});

// Get questions
/*app.get('/api/exam/questions', (req, res) => {
    db.query('SELECT * FROM exam_questions WHERE question_type = "descriptive"', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});*/

// POST API to calculate the score for each answer
app.post('/api/exam/calculate-score', (req, res) => {
    const { question_id, student_answer } = req.body;

    db.query('SELECT full_answer FROM exam_questions WHERE question_id = ?', [question_id], (err, results) => {
        if (err) {
            console.error('Error fetching question:', err);
            return res.status(500).json({ message: 'Error fetching question' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const correctAnswer = results[0].full_answer;
        const score = calculateScore(correctAnswer, student_answer);

        res.json({ score }); // Return the score to the client
    });
});

// POST API to submit the entire exam
app.post('/api/exam/submit-exam', (req, res) => {
    const { student_id, exam_title, exam_role, total_score } = req.body;

    db.query(
        'INSERT INTO results (student_id, exam_title, exam_role, score) VALUES (?, ?, ?, ?)',
        [student_id, exam_title, exam_role, total_score],
        (err) => {
            if (err) {
                console.error('Error saving final result:', err);
                return res.status(500).json({ message: 'Error saving final result' });
            }

            res.json({ message: 'Exam submitted successfully!', total_score });
        }
    );
});

// Helper function to calculate score
function calculateScore(correctAnswer, studentAnswer) {
    const correctKeywords = correctAnswer.split(' ').map(word => word.toLowerCase());
    const studentKeywords = studentAnswer.split(' ').map(word => word.toLowerCase());
    const matchedKeywords = studentKeywords.filter(keyword => correctKeywords.includes(keyword));
    return (matchedKeywords.length / correctKeywords.length) * 100; // Percentage score
}

// API to fetch the most recently published exam
app.get('/api/exam_schedule/current', (req, res) => {
    const sql = `
        SELECT exam_name, exam_date, duration, total_marks
        FROM exam_schedule
        ORDER BY exam_date DESC
        LIMIT 1
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching current exam schedule:', err);
            return res.status(500).json({ message: 'Error fetching current exam schedule.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No exams found in the schedule.' });
        }

        res.json(results[0]);
    });
});

// API to fetch questions for the specified exam
// Fetch descriptive questions for an exam
app.get('/api/exam-questions/:exam_title/descriptive', (req, res) => {
    const { exam_title } = req.params;

    if (!exam_title) {
        return res.status(400).json({ message: 'Missing exam_title parameter.' });
    }

    const sql = `
        SELECT question_id, question_text, full_answer
        FROM exam_questions
        WHERE exam_title = ? AND question_type = 'descriptive'
    `;

    db.query(sql, [exam_title], (err, results) => {
        if (err) {
            console.error(`Error fetching descriptive questions for exam_title "${exam_title}":`, err);
            return res.status(500).json({ message: 'Error fetching descriptive questions from the database.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No descriptive questions found for the specified exam.' });
        }

        res.json(results);
    });
});
// Remaining endpoints (calculate-score, submit-exam) remain unchanged
// Add your API routes here (e.g., student registration, staff registration, login, etc.)
// Example API route:
app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the API!' });
});

// Start the server
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    try {
        // Start Ngrok with the specified port
        const url = await ngrok.connect(PORT);
        console.log(`Ngrok tunnel established at: ${url}`);
        console.log(`You can now access your application at: ${url}`);
    } catch (err) {
        console.error('Error starting Ngrok:', err);
    }
});