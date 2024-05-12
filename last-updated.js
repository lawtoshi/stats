const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.get('/last-updated', (req, res) => {
    fs.stat('/home4/knbrhemy/public_html/stats/UpdatedData.json', (err, stats) => {
        if (err) {
            console.error('Error fetching file stats:', err);
            res.status(500).send('Error fetching update time');
            return;
        }
        res.json({ lastUpdated: stats.mtime });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
