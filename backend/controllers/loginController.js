const loginService = require('../services/loginService')

const handleLogin = async (req, res) => {
    
    try {
        const { username, email } = req.body

        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required" })
        }

        const token = await loginService.authenticateUser(username, email)

        if (!token) {
            return res.status(500).send({ message: "Token is invalid!" })
        }

        return res.status(200).json({ token })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
    
}

module.exports = { handleLogin }