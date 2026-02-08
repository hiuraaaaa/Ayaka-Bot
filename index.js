import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { fork } from 'child_process'
import { createInterface } from 'readline'
import { watchFile, unwatchFile } from 'fs'
import http from 'http'
import yargs from 'yargs'
import cfonts from 'cfonts'
import chalk from 'chalk'

const { say } = cfonts

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

const { name, author } = require(join(__dirname, './package.json'))

say('Hiura', {
  font: 'chrome',
  align: 'center',
  gradient: ['blue', 'green']
})

say(`by Hiura `, {
  font: 'console',
  align: 'center',
  gradient: ['blue', 'green']
})

let isRunning = false
let childProcess = null
const rl = createInterface(process.stdin, process.stdout)

function start(file) {
  if (isRunning) return
  isRunning = true

  const args = [join(__dirname, file), ...process.argv.slice(2)]

  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  })

  childProcess = fork(args[0], args.slice(1))

  childProcess.on('message', handleMessage)
  childProcess.on('exit', handleExit.bind(null, args))

  const opts = yargs(process.argv.slice(2)).exitProcess(false).parse()
  if (!opts['test']) {
    rl.on('line', line => childProcess.send(line.trim()))
  }
}

function handleMessage(data) {
  console.log('[Success]', data)
  switch (data) {
    case 'reset':
      restart()
      break
    case 'uptime':
      childProcess.send(process.uptime())
      break
  }
}

function handleExit(args, code) {
  isRunning = false
  console.error('Child Process Exited with Code:', code)

  if (code !== 0) {
    restart()
  } else {
    watchFile(args[0], () => {
      unwatchFile(args[0])
      restart()
    })
  }
}

function restart() {
  if (childProcess) {
    childProcess.kill()
    childProcess = null
  }
  start('main.js')
}

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World!\n')
}).listen(3000, () => {
  console.log(`\nCita cita ku hanya ingin menjadi yang terbaik.`)
})

start('main.js')
