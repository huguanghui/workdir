var localConfig = require('./config.json')

module.exports = function() {    
    console.log('Test')
    console.log('Name: ' + localConfig.name + ' Time: ' + localConfig.time)
}