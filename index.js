const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "None";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    try {
      // Make GET request to retrieve custom object data (custom properties)
      const response = await axios.get('https://api.hubapi.com/crm/v3/objects/2-140140606?properties=name, objectives, roi_criteria', {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`, // Replace with your API key
          'Content-Type': 'application/json'
        }
      });
  
      // Retrieve data for the custom objects
      const customObjects = response.data.results;
      console.log(customObjects)
      // Render the homepage Pug template and pass the custom object data to it
      res.render('homepage', { customObjects });
    } catch (err) {
      console.error('Error retrieving custom object data:', err.response ? err.response.data : err.message);
      res.status(500).send('Failed to retrieve custom object data.');
    }
  });

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    const pageTitle = 'Update Custom Object Form | Integrating With HubSpot I Practicum';
    res.render('updates', { pageTitle });
  
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.


// Route to handle the form submission
app.post('/update-cobj', async (req, res) => {
  // Assuming the form sends a "name" and "description" field
  const { name, objectives, roi_criteria} = req.body;

  // Prepare data for HubSpot custom object
  const customObjectData = {
    properties: {
      name: name,
      objectives: objectives,
      roi_criteria: roi_criteria,
    }
  };

  try {
    // Send the data to HubSpot API to create or update the custom object
    const response = await axios.post('https://api.hubapi.com/crm/v3/objects/2-140140606', customObjectData, {
      headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,  // Replace with your actual API key
        'Content-Type': 'application/json'
      }
    });

    // After creating/updating the custom object, redirect to the homepage or another route
    res.redirect('/');
  } catch (err) {
    console.error("Error creating/updating custom object:", err.response ? err.response.data : err.message);
    res.status(500).send('Failed to create or update the custom object.');
  }
    });


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));

// app.get for homepage



// app.get for updates


// app.post for updates
