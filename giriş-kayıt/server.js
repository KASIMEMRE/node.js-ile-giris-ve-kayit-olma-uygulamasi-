const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Simüle edilmiş kullanıcı veritabanı
const users = new Map();

app.use(express.json());
app.use(express.static('public'));

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (users.has(email)) {
            return res.status(400).json({ message: 'Bu email adresi zaten kayıtlı' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.set(email, { email, password: hashedPassword });

        res.status(201).json({ message: 'Kayıt başarılı' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.get(email);

        if (!user) {
            return res.status(401).json({ message: 'Email veya şifre hatalı' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Email veya şifre hatalı' });
        }

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});