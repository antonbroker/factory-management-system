const axios = require('axios');
const jwt = require('jsonwebtoken');
const { initUserActions } = require('./actionsService');

// Authorization (valid user, JWT)
const authenticateUser = async (username, email) => {
 
    try {
        const { data : users} = await axios.get('https://jsonplaceholder.typicode.com/users')
    
        const user = users.find(user => (user.username === username && user.email === email))

        if (!user) {
            console.log("User not found")
            return null
        }
        
        console.log("User was found: ", user.username);

        // get token JWT
        const token = jwt.sign({
            id: user.id, 
            username: user.username, 
            email: user.email 
        },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        // init actions of current user
        await initUserActions(user.id)

        console.log(token)
        return token

    } catch (error) {
        console.error("Error in authenticateUser:", error.message)
        return null;
    }

}

module.exports = { authenticateUser }