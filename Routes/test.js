import express from 'express';  // Import Express
import sql from 'msnodesqlv8';  // Import msnodesqlv8 for SQL Server connection

const app = express();
const port = 3000;

// Database connection string
const connStr =
    'server=.;' + 
    'Database=Project2026;' +
    'Trusted_Connection=Yes;' +          // <— no user/pass needed
    'Driver={ODBC Driver 17 for SQL Server}';

// Endpoint to serve images
app.get('/image/:id', async (req, res) => {
    const imageId = req.params.id;  // Get image ID from URL parameter

    try {
        // Open the SQL Server connection
        sql.open(connStr, (err, conn) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return res.status(500).send('Database connection failed');
            }

            // SQL Query to retrieve image data based on ImageId
            const query = `SELECT ImageName, ImageData FROM dbo.AccidentImages WHERE ImageId = ${imageId}`;

            // Run the query
            conn.query(query, (err, rows) => {
                if (err) {
                    console.error('Error fetching data:', err);
                    return res.status(500).send('Error fetching image');
                }

                if (rows.length === 0) {
                    return res.status(404).send('Image not found');
                }

                const imageData = rows[0].ImageData;  // Image data
                const imageName = rows[0].ImageName;  // Image name

                // Set the response headers for the image
                res.setHeader('Content-Type', 'image/png');  // You can change this dynamically based on the file type
                res.setHeader('Content-Disposition', `inline; filename="${imageName}"`);

                // Send the image data as the response
                res.send(imageData);
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
