const WebSocket = require('ws')
const express = require('express')
const chalk = require('chalk')
const app = express()
const WS_PORT = 3030
const wss = new WebSocket.Server({ port: WS_PORT })
const argv = require('minimist')(process.argv.slice(2))
const filter = argv.filter
let connections = {}

function printHelp() {
  console.log(
    chalk.underline('\nPress any of the following keys:'),
    `\n • T - Run Tests${
      filter ? ': filter set to match tests including "' + filter + '"' : ''
    }`,
    '\n • H - Print this help text',
    '\n • D - Print list of connected devices',
    '\n • Q - Quit',
    '\n',
  )
}

const stdin = process.stdin
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')
stdin.on('data', (key) => {
  // ctrl-c to end
  if (key === '\u0003') {
    process.exit()
  }
  if (key.toLowerCase() === 'q') process.exit()
  if (key.toLowerCase() === 'h') printHelp()
  if (key.toLowerCase() === 'd') {
    console.log(chalk.bold(chalk.underline('\nConnected Devices:')))
    Object.values(connections).forEach((client) =>
      console.log(' • ' + client.name),
    )
    console.log('\n')
  }
})

wss.on('connection', function connection(client) {
  const handleKeypress = (key) => {
    if (key.toLowerCase() === 't')
      client.send(JSON.stringify({ status: 'RUNTEST', filter }))
  }
  client.on('message', function incoming(payload) {
    const data = JSON.parse(payload)
    switch (data.status) {
      case 'CONNECTED': {
        console.log('"' + data.deviceName + '" has connected!')
        stdin.on('data', handleKeypress)
        client.name = data.deviceName
        client.installationId = data.installationId
        connections[client.installationId] = client
        break
      }
      case 'DISCONNECTED': {
        console.log('App connection lost!')
        break
      }
      case 'RUNNING': {
        console.log(chalk.green('Test started!'))
        break
      }
      case 'NOTRUNNING': {
        break
      }
      case 'REPORT': {
        const { results, errorCount, duration } = data
        results.forEach((result, index) => {
          message = `[${data.deviceName}] - ${index + 1}) ${result['message']}`

          if (result['passed']) {
            // Log green test result if test passed
            console.log(chalk.green(message))
          } else {
            // Log red test result if test failed
            console.log(chalk.red(message))
          }
        })

        console.log(`[${data.deviceName}] Finished in ${duration} seconds`)
        const endMsg = `[${data.deviceName}] Examples: ${
          results.length
        }, Errors: ${errorCount}`
        if (!errorCount) {
          console.log(chalk.green(endMsg))
        } else {
          console.log(chalk.red(endMsg))
        }
      }
    }
  })
  client.on('close', function() {
    if (client.name) {
      console.log('"' + client.name + '" has closed the connection.')
      delete connections[client.installationId]
    }
    stdin.removeListener('data', handleKeypress)
  })
})

app.use('/public', express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public'))
app.use(express.json())

app.post('/report', (req, res) => {
  if (req.body['message']) console.log(req.body.message)
  else {
    const results = req.body['results']
    const errorCount = req.body['errorCount']
    const duration = req.body['duration']

    results.forEach((result, index) => {
      message = `${index + 1}) ${result['message']}`

      if (result['passed']) {
        // Log green test result if test passed
        console.log(chalk.green(message))
      } else {
        // Log red test result if test failed
        console.log(chalk.red(message))
      }
    })

    console.log(`Finished in ${duration} seconds`)
    const endMsg = `Examples: ${results.length}, Errors: ${errorCount}`

    // If all tests pass, exit with code 0, else code 1
    if (!errorCount) {
      console.log(chalk.green(endMsg))
      res.send('ok')
      // process.exit(0);
    } else {
      console.log(chalk.red(endMsg))
      res.send('failed')
      // process.exit(1);
    }
  }
})

var PORT = 8082
app.listen(PORT, function() {
  console.log(
    chalk.green('Test server Websocket open via port ' + WS_PORT + '!\n'),
  )
  printHelp()
  console.log(
    chalk.green('\nWaiting for app to connect...'),
    chalk.white('\n(you might need to refresh the app to make it connect)'),
  )
})
