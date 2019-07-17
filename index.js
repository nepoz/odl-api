const app = require('./app')
const http = require('http')
const config = require('./utils/config')

const server = http.createServer(app)

server.listen(config.PORT || 3001, () => {
    console.log(`Server listening on port ${config.PORT}`)
})