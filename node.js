//1
// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');

// Create an Express application
const app = express();
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'your_db_host',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
});

// Add Customer API endpoint
app.post('/api/customers', async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    // Validate input parameters
    if (!name || !phoneNumber) {
      return res.status(400).json({ error: 'Name and phone number are required.' });
    }

    // Check for duplicates
    const connection = await pool.getConnection();
    const [existingCustomer] = await connection.execute('SELECT * FROM customers WHERE phoneNumber = ?', [phoneNumber]);
    connection.release();

    if (existingCustomer.length > 0) {
      return res.status(409).json({ error: 'Customer with the same phone number already exists.' });
    }

    // Insert customer into the database
    const insertQuery = 'INSERT INTO customers (name, phoneNumber) VALUES (?, ?)';
    const insertParams = [name, phoneNumber];

    const [insertResult] = await pool.query(insertQuery, insertParams);

    console.log(`Customer added: ${name}`);

    return res.status(201).json({ success: true, customerId: insertResult.insertId });
  } catch (error) {
    console.error(`Error adding customer: ${error}`);
    return res.status(500).json({ error: 'An error occurred while adding the customer.' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});//2
SELECT
  c.customerid,
  c.name,
  GROUP_CONCAT(s.subject ORDER BY s.subject SEPARATOR ',') AS subjects
FROM
  customers c
JOIN
  student_subjects ss ON c.customerid = ss.customerid
JOIN
  subjects s ON ss.subjectid = s.subjectid
GROUP BY
  c.customerid,
  c.name;
//3
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Function to insert data into MySQL
function insertData(data) {
  return new Promise((resolve, reject) => {
    // Loop through each data object in the array
    for (let i = 0; i < data.length; i++) {
      const { name, email } = data[i];
      // Check if the email already exists in the database
      connection.query('SELECT * FROM customers WHERE email = ?', [email], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows.length > 0) {
          // Update the name for existing customer
          connection.query('UPDATE customers SET name = ? WHERE email = ?', [name, email], (err) => {
            if (err) {
              reject(err);
              return;
            }
            console.log(`Updated name for customer with email ${email}`);
          });
        } else {
          // Insert new customer
          connection.query('INSERT INTO customers (name, email) VALUES (?, ?)', [name, email], (err) => {
            if (err) {
              reject(err);
              return;
            }
            console.log(`Inserted new customer with email ${email}`);
          });
        }
      });
    }
    resolve();
  });
}

// Example data array
const dataArray = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' },
  { name: 'Mike Johnson', email: 'john@example.com' }
];

// Call the insertData function with the data array
insertData(dataArray)
  .then(() => {
    console.log('Data insertion completed');
    // Close the MySQL connection
    connection.end();
  })
  .catch(err => {
    console.error('Error inserting data:', err);
    // Close the MySQL connection
    connection.end();
  });

//4
const person = {
  id: 2,
  gender: 'mail'
};

const student = {
  name: "ravi",
  email: "ravi11@yopmail.com"
};

const combinedObject = {
  ...person,
  ...student
};

console.log(combinedObject);
//5
const request = require('request');
const util = require('util');

const getGoogleHomePage = () => {
  return new Promise((resolve, reject) => {
    request('http://www.google.com', (error, response, body) => {
      if (error) {
        console.error('error:', error);
        reject(error);
      } else {
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        resolve(body);
      }
    });
  });
};

// Usage:
getGoogleHomePage()
  .then(result => {
    console.log("RESULT==>", result);
  })
  .catch(error => {
    console.error("ERROR==>", error);
  });
