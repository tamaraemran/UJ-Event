const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const { check, validationResult } = require('express-validator');

const app = express();

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'uj_event_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
});

// Validation rules
const contactValidate = [
    check("firstName")
        .isLength({ min: 1, max: 100 }).withMessage("First name must be between 1 and 100 chars.")
        .isString().withMessage("First name must be a string")
        .matches(/^[A-Za-z\s]+$/).withMessage("First name must consist of letters only")
        .trim().escape(),
    
    check("lastName")
        .isLength({ min: 1, max: 100 }).withMessage("Last name must be between 1 and 100 chars.")
        .isString().withMessage("Last name must be a string")
        .matches(/^[A-Za-z\s]+$/).withMessage("Last name must consist of letters only")
        .trim().escape(),

    check("email").isEmail().withMessage("Email must be of format x@y.z").trim().escape(),

    check("mobile")
        .isNumeric().withMessage("Mobile must be numbers only")
        .isLength({ min: 10, max: 10 }).withMessage("Mobile must be 10 digits"),

    check("message").trim().notEmpty().withMessage("Message cannot be empty").escape()
];

const eventValidate = [
    check("eventTitle").trim().notEmpty().withMessage("Event title is required").escape(),
    check("eventDate").isDate().withMessage("Invalid event date"),
    check("eventTime").trim().notEmpty().withMessage("Event time is required").escape(),
    check("eventLocation").trim().notEmpty().withMessage("Event location is required").escape(),
    check("eventCategory").trim().notEmpty().withMessage("Event category is required").escape(),
    check("eventDescription").trim().notEmpty().withMessage("Event description is required").escape()
];

// 1. contact form submission with validation
app.post('/submit-form', contactValidate, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { firstName, lastName, email, mobile, dob, language, gender, message } = req.body;
    const sql = "INSERT INTO contact_messages (firstName, lastName, email, mobile, dob, language, gender, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [firstName, lastName, email, mobile, dob, language, gender, message], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, message: "Thank you, your information has been saved." });
    });
});

// 2. add new event with validation
app.post('/add-new-event', eventValidate, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { eventTitle, eventDate, eventTime, eventLocation, eventCategory, eventDescription } = req.body;
    const sql = "INSERT INTO events (eventTitle, eventDate, eventTime, eventLocation, eventCategory, eventDescription) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [eventTitle, eventDate, eventTime, eventLocation, eventCategory, eventDescription], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, message: "Event added successfully!" });
    });
});

// 1. home page route - only upcoming events
app.get('/get-home-events', (req, res) => {
    const sql = "SELECT * FROM events WHERE eventDate >= CURDATE() ORDER BY eventDate ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json(results);
    });
});

// 2. events listing page - all events
app.get('/get-events', (req, res) => {
    const sql = "SELECT * FROM events ORDER BY eventDate ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json(results);
    });
});

// 4. registration route with validation and duplicate check
app.post('/register-student', [
    check('studentName').trim().notEmpty().withMessage('Student name is required').escape(),
    check('studentID').isNumeric().withMessage('Student ID must be numeric'),
    check('eventID').notEmpty().withMessage('Event selection is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { studentName, studentID, eventID } = req.body;

    const checkSql = "SELECT * FROM registrations WHERE studentID = ? AND eventID = ?";
    db.query(checkSql, [studentID, eventID], (err, results) => {
        if (err) return res.status(500).json({ success: false });

        if (results.length > 0) {
            return res.json({ success: false, message: "You are already registered for this event!" });
        }

        const insertSql = "INSERT INTO registrations (studentName, studentID, eventID) VALUES (?, ?, ?)";
        db.query(insertSql, [studentName, studentID, eventID], (err, result) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true, message: "Registration successful!" });
        });
    });
});
app.get('/count-upcoming-events', (req, res) => {
    //count only upcoming events using CURDATE
    const sql = "SELECT COUNT(*) AS total FROM events WHERE eventDate >= CURDATE()";
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ count: results[0].total });
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});