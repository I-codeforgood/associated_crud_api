const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const users = [{
    id: 1,
    email: 'admin@codesfortomorrow.com',
    passwordHash: '$2a$10$yz2ADvA93IDa1vN/MdIal.v.AX6BpBhAB.E0HlLBPmFoN4DBFDXy.' // bcrypt hash for 'Admin123!@#'
}];

router.post('/login', (req, res) => {
    const {
        email,
        password
    } = req.body;

    const user = users.find(u => u.email === email);
    console.log("User : ", user)

    if (!user || !bcrypt.compare(password, user.passwordHash)) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign({
        userId: user.id,
        email: user.email
    }, "My Secret Key", {
        expiresIn: '1h'
    });

    res.status(200).json({
        token
    });
});

module.exports = router