const express = require('express'); 
const router = express.Router();
const db = require('../db/database'); // Ensures the database connection is exported

// Home Route
router.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to AdventureLand' });
});

// Areas Route
router.get('/areas', (req, res) => {
    // SQL query to retrieve areas and their rides/attractions
    const sql = `
      SELECT areas.id as area_id, areas.name as area_name, areas.description as area_description, areas.image_url,
             rides.id as ride_id, rides.name as ride_name, rides.description as ride_description
      FROM areas
      LEFT JOIN rides ON rides.area_id = areas.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message); // Log the error message to the console
            res.status(500).send('Error retrieving areas'); // Return an error message to the client
            return;
        }

        // Process rows to group rides by areas
        const areas = {};
        rows.forEach(row => {
            if (!areas[row.area_id]) {
                areas[row.area_id] = {
                    id: row.area_id,  // Passes the area_id for dynamic links
                    name: row.area_name,
                    description: row.area_description,
                    image_url: row.image_url,
                    rides: []
                };
            }
            if (row.ride_id) {
                areas[row.area_id].rides.push({
                    name: row.ride_name,
                    description: row.ride_description
                });
            }
        });

        // Convert areas object to array format
        const areasArray = Object.values(areas);

        // Render the 'areas' page with the data
        res.render('areas', { title: 'Our Themed Areas', areas: areasArray });
    });
});

// Rides & Attractions Route for a Specific Area
router.get('/areas/:areaId/rides', (req, res) => {
    const areaId = req.params.areaId;  // Get the area ID from the URL

    // SQL query to retrieve the rides for the specific area, including the image URL
    const sql = `
        SELECT name, description, image_url FROM rides WHERE area_id = ?
    `;

    db.all(sql, [areaId], (err, rows) => {
        if (err) {
            console.error(err.message); // Log error if any
            res.status(500).send('Error retrieving rides for the area');
            return;
        }

        // Render the 'rides' page with the rides data
        res.render('rides', { title: `Rides & Attractions for Area ${areaId}`, rides: rows });
    });
});

// Events Route
router.get('/events', (req, res) => {
    // Retrieves all events from the database
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving events:', err.message); // Log any database errors
            res.status(500).send('Error retrieving events'); // Return a client-side error
            return;
        }
        // Render the 'events' page with the data
        res.render('events', { title: 'Events', events: rows });
    });
});

// Games Route
router.get('/games', (req, res) => {
    // SQL query to retrieve all games from the database
    const sql = 'SELECT * FROM games';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving games:', err.message); // Log any database errors
            res.status(500).send('Error retrieving games');
            return;
        }
        // Render the 'games' page with the games data
        res.render('games', { title: 'Games', games: rows });
    });
});
router.post('/games/:gameId/score', (req, res) => {
    const gameId = req.params.gameId;
    const { userId, score } = req.body; // Assume we get this from the request body

    const sql = 'INSERT INTO game_scores (game_id, user_id, score) VALUES (?, ?, ?)';
    db.run(sql, [gameId, userId, score], (err) => {
        if (err) {
            console.error('Error saving game score:', err.message);
            res.status(500).send('Error saving score');
            return;
        }
        res.status(200).send('Score saved successfully!');
    });
});



// FAQ Route
router.get('/faq', (req, res) => {
    // Retrieves all FAQs from the database
    db.all('SELECT * FROM faqs', [], (err, rows) => {
        if (err) {
            console.error(err.message); // Log any database errors
            res.status(500).send('Error retrieving FAQs'); // Return error message to the client
            return;
        }
        // Render the 'faq' page with the data
        res.render('faq', { title: 'Frequently Asked Questions', faqs: rows });
    });
});

// Contact Us Route
router.get('/contact', (req, res) => {
    // Render the 'contact' page
    res.render('contact', { title: 'Contact Us' });
});

// Search Route
router.get('/search', (req, res) => {
    const query = req.query.query; // Get the search query from the request

    // SQL query to search items in the database based on the query
    db.all('SELECT * FROM items WHERE name LIKE ?', [`%${query}%`], (err, rows) => {
      if (err) {
        console.error(err.message); // Log any errors
        res.status(500).send('Error retrieving search results'); // Return error message
        return;
      }
      // Return the search results as JSON
      res.json({ results: rows });
    });
});

// Contact form submission route
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body; // Extract form data

    // Insert the contact message into the 'contacts' table in the database
    const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    db.run(sql, [name, email, message], (err) => {
        if (err) {
            console.error("Database error: ", err.message); // Log any database errors
            return res.status(500).send(`Error saving your message: ${err.message}`);
        }
        // Redirect to homepage on successful submission
        res.redirect('/');
    });
});

module.exports = router; // Export the router
