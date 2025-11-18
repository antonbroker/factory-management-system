const jwt = require('jsonwebtoken')
const usersService = require('../services/usersService')
const jf = require('jsonfile')
const FILE = __dirname + "/../data/actions.json"


const checkUserActions = async (req, res, next) => {
    try {
        // Getting token
        const authHeader = req.headers['authorization'] || req.headers['Authorization']
        if (!authHeader) {
            console.log("No Authorization header in request!")
            return res.status(401).json({ message: 'No token provided' })
        }

        const token = authHeader.split(' ')[1]
        if (!token) return res.status(401).json({ message: 'Invalid token format' })

        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Search user in DB
        const user = await usersService.findByUsernameAndEmail(decoded.username, decoded.email)
        if (!user) return res.status(404).json({ message: 'User not found' })

        // if GET method, it's not an action
        if (req.method === 'GET') {
            return next()
        }

        // Check date of last action
        const today = new Date().toLocaleDateString('en-GB') // "DD/MM/YYYY"
        const lastAction = new Date(user.lastActionDate).toLocaleDateString('en-GB')

        if (today !== lastAction) {
            // new day - refresh limit
            user.numOfActions = user.maxActionsPerDay
            user.lastActionDate = new Date()
            await user.save()
        }

        if (user.numOfActions <= 0) {
            return res.status(403).json({ message: 'Action limit reached. Try again tomorrow.' })
        }

        user.numOfActions -= 1
        user.lastActionDate = new Date()
        await user.save()

        try {
            const data = await jf.readFile(FILE)

            data.actions.push({
              id: user._id.toString(),
              maxActions: user.maxActionsPerDay,
              date: today,
              actionsAllowed: user.numOfActions
            })

            await jf.writeFile(FILE, data, { spaces: 2 })

          } catch (err) {
            console.error('Error writing actions.json:', err.message)
          }
        next()

    } catch (err) {
        console.error('Error in checkUserActions:', err.message)
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

module.exports = { checkUserActions }
