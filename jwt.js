const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // Check if Authorization header is provided
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token Not Found' });
    }

    // Expect the header to have the format "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Token error' });
    }

    // Extract and trim the token
    const token = parts[1].trim();
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify the JWT token using the secret in your environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Function to generate a JWT token. Using a string for expiresIn is more readable.
const generateToken = (userData) => {
    // If you intend the token to expire in 30 seconds, use '30s'
    return jwt.sign(userData, process.env.JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken };
