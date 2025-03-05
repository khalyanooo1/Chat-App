const express = require('express');
const router = express.Router();

// Sample Chat Route
router.get('/messages', (req, res) => {
    res.json({ message: "Chat API is working!" });
});

module.exports = router;
