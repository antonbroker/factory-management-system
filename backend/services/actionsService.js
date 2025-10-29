const jf = require('jsonfile')
const FILE = './data/actions.json'

const initUserActions = async (id) => {
    // Date of today
    const today = new Date().toLocaleDateString('en-GB'); 

    const data = await jf.readFile(FILE)
    const actions = data.actions
    const existedAction = actions.find(act => act.id === id && act.date === today)

    if (!existedAction) {
        actions.push({
            id,
            maxActions: 10,
            date: today,
            actionsAllowed: 10
        })

        await jf.writeFile(FILE, data, { spaces: 2 })
    }
}

module.exports = { initUserActions }