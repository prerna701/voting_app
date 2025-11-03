const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const candidate = require("./../models/candidate");
const {jwtAuthMiddleware, generateToken} = require('./../jwt');


// POST route to add a person
// previous
// router.post('/signup', async (req, res) =>{
//     try{
//         const data = req.body // Assuming the request body contains the User data

//         // Check if there is already an admin user
//         const adminUser = await User.findOne({ role: 'admin' });
//         if (data.role === 'admin' && adminUser) {
//             return res.status(400).json({ error: 'Admin user already exists' });
//         }

//         // Validate Aadhar Card Number must have exactly 12 digit
//         if (!/^\d{12}$/.test(data.aadharCardNumber)) {
//             return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
//         }

//         // Check if a user with the same Aadhar Card Number already exists
//         const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
//         if (existingUser) {
//             return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
//         }

//         // Create a new User document using the Mongoose model
//         const newUser = new User(data);

//         // Save the new user to the database
//         const response = await newUser.save();
//         console.log('data saved');

//         const payload = {
//             id: response.id
//         }
//         console.log(JSON.stringify(payload));
//         const token = generateToken(payload);

//         res.status(200).json({response: response, token: token});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })
// trial
router.post('/signup', async (req, res) => {
    try {
        const data = req.body; // Assuming the request body contains the User data

        // Validate Aadhar Card Number (12 digits check)
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();

        const payload = {
            id: response.id
        }

        const token = generateToken(payload); // Generate token after successful signup

        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Login Route
// Login Route (common for all users including admin)
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;

        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        const user = await User.findOne({ aadharCardNumber });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Aadhar Card Number or Password' });
        }

        // Admin-specific check
        if (user.role === 'admin') {
            const token = generateToken({ id: user.id, role: 'admin' });
            return res.json({ token, message: 'Admin login successful', role: 'admin' });
        }

        // General user
        const token = generateToken({ id: user.id, role: user.role });
        res.json({ token, message: 'User login successful', role: user.role });
        
        

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});// Route to get all candidates, accessible only by admin
router.get('/candidates', jwtAuthMiddleware, async (req, res) => {
    // Ensure the user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access forbidden' });
    }

    try {
        const candidates = await candidate.find(); // Fetch all candidates from the DB
        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching candidates' });
    }
});



module.exports = router;