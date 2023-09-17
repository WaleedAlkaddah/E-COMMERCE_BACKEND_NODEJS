const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'db2',
});

const pool = mysql.createPool(db);


db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});



app.post('/signup', (req, res) => {
  const { customer_first_name, customer_last_name , customer_email, customer_password } = req.body;
  const query = 'INSERT INTO db2.Customers (customer_first_name, customer_last_name , customer_email, customer_password) VALUES (?, ? ,?,?)';
  db.query(query, [customer_first_name, customer_last_name , customer_email, customer_password], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'An error occurred while creating the user', details: err.message });
    }
     else {
      res.status(201).json({ message: 'User created successfully' });
    }
  });
});

app.post('/login', (req, res) => {
  const { customer_email, customer_password } = req.body;
  const query = 'SELECT * FROM Customers WHERE customer_email = ? AND customer_password = ?';
  db.query(query, [customer_email, customer_password], (err, results) => {
    if (err) {
      console.error('Error during login:', details.err);
      res.status(500).json({ error: 'An error occurred during login' });
    } else {
      if (results.length === 1) {
        res.json(results);
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});




//Admin


// Get Count Customers
app.get('/read.customer', (req, res) => {
  const query = 'SELECT count(*) FROM Customers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', details.err);
      res.status(500).json({ error: 'An error occurred while fetching users' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get Count NFT
app.get('/read.nft', (req, res) => {
  const query = 'SELECT count(*) FROM image';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching image:', details.err);
      res.status(500).json({ error: 'An error occurred while fetching image' });
    } else {
      res.status(200).json(results);
    }
  });
});


//add item
app.post('/additem', (req, res) => {
  const { image_name, image_description , image_file } = req.body;
  const query = 'INSERT INTO db2.image (image_name, image_description , image_file) VALUES (?, ? ,?)';
  db.query(query, [image_name, image_description , image_file], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'An error occurred while add the image', details: err.message });
    }
     else {
      res.status(201).json({ message: 'Added successfully' });
    }
  });
});



// Update image
app.put('/update/:id', (req, res) => {
  const image_id = req.params.id;
  const { image_name, image_description , image_file } = req.body;
  const query = 'UPDATE db2.image SET image_name = ?, image_description = ? , image_file = ? WHERE image_id = ?';
  db.query(query, [image_name, image_description , image_file, image_id], (err, result) => {
    if (err) {
      console.error('Error updating image:', details.err);
      res.status(500).json({ error: 'An error occurred while updating the image' });
    } else {
      res.status(200).json({ message: 'Image updated successfully' });
    }
  });
});


// Delete image
app.delete('/delete/:id', (req, res) => {
  const image_id = req.params.id;
  const query = 'DELETE FROM db2.image WHERE image_id = ?';
  db.query(query, [image_id], (err, result) => {
    if (err) {
      console.error('Error deleting image:', err);
      res.status(500).json({ error: 'An error occurred while deleting the image' });
    } else {
      res.status(200).json({ message: 'Image deleted successfully' });
    }
  });
});


//View specific
app.get('/items/:id', (req, res) => {
  const image_id = req.params.id;
  db.query('SELECT * FROM db2.image WHERE image_id = ?', [image_id], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'An error occurred' });
      } else {
          if (results.length === 0) {
              res.status(404).json({ error: 'Item not found' });
          } else {
              res.json(results[0]);
          }
      }
  });
});





//Customer

// Get NFT
app.get('/read.nft', (req, res) => {
  const query = 'SELECT * FROM db2.image';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching image:', details.err);
      res.status(500).json({ error: 'An error occurred while fetching image' });
    } else {
      res.status(200).json(results);
    }
  });
});


//Buy
app.put('/buy', (req, res) => {
  const { image_id, customer_id } = req.body;

  if (!image_id || !customer_id) {
    return res.status(400).json({ error: 'Image_Id and Customer_id are required.' });
  }

  const updateQuery = 'UPDATE db2.image SET image_buy = 1 , customer_id = ? WHERE image_id = ?';

  pool.query(updateQuery, [true, image_id, customer_id], (error, results) => {
    if (error) {
      console.error('Error buy', error);
      return res.status(500).json({ error: 'An error occurred while buy ' });
    }
    res.json({ message: 'Buy successfully.' });
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
