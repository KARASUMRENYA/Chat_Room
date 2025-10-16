// Path : C:/Users/avikg/Webdev/BACKEND/router.js


// Import necessary modules and initialize router:......................
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');

const pool = require('./DB_handling/db_conc.js');
const path = require('path');
const initSocket = require('./socket/chatsocket.js');



// JWT configuration:....................................................
const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRY = '30m'; // Token expiry time
//......................................................................

//.............ROUTER CRUD METHODS........................................
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'FRONTEND', 'signup.html'));
});
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'FRONTEND', 'login.html'));
});
router.get('/test2', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'FRONTEND', 'test2.html'));
});
//.......................................................................

//Create a new user by POST request:.....................................
// ......................................................................
router.post('/signup', async(req, res) => {

  console.log("req.body = ", req.headers);

  try {
    
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.json({success : false, message: 'Please provide name, email and password'});
        console.log('Please provide name, email and password');
        return;
    }

    try{
          const result = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
          if(result.rows.length > 0){
              res.json({success : false, message: 'User already exists'});
              console.log('User already exists');
              return;
          }
          else{
                try{
                      const saltrounds = 10;
                      const hashedPassword = await bcrypt.hash(password, saltrounds);
                      await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);
                      res.json({success : true, message: 'User created successfully'});
                      console.log('User created successfully');

               }catch (error) {

                  console.log(error);
                  res.json({success : false, message: 'User not so successfully created'});
                  console.log('User not so successfully created');
                  return;
                }
          }

        }catch (error) {
          console.log("Error in checking existing user "+error);
          res.json({success : false, message: 'Error in checking existing user : Some error occured'});
          return;
        }
        



    
}catch (error) {
    console.log(error);
    res.json({success : false, message: 'Some request error occured' + error});
}
});

// Login a user by POST request:-----------------------------------------

router.post('/login', async(req, res) => {
  console.log(req.headers);

  try {
    
    const { name, email, password } = req.body;
     if (!name || !email || !password) {
        res.json({success : false, message: 'Please provide name, email and password'});
        console.log('Please provide name, email and password');
        return;
    }

    try{
         const result = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
         console.log(result);

         if (result.rows.length > 0) {

          const isMatch  = await bcrypt.compare(password, result.rows[0].password);
            if (isMatch) { // compare passwords

             //giving jwt tokens
              const token = jwt.sign({ id: result.rows[0].id, email: result.rows[0].email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
              console.log("Generated Token: ", token);

               res.json({ success: true,
                 message: 'User logged in successfully',
                 token , name: result.rows[0].name
                 });
                 
              } else {
                  res.json({ success: false, message: 'Incorrect password' });
        }
      } else {
                res.json({ success: false, message: 'User not found' });
      }
  
    }catch (error) {
          console.log("Error in login "+error);
          res.json({success : false, message: 'Some error occured'});
    }
    
}catch (error) {
    console.log(error);
    res.json({success : false, message: 'Some request error occured' + error});
}


});
//-----------------------------------------------------------------------
module.exports = router;
