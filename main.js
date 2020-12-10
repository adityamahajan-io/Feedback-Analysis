const { BrowserWindow, app } = require('electron')
const path =require("path")
require('./app.js')

let mainWindow = null
iconPath = path.join(__dirname, '/icon/icon.png');
function main() {
  mainWindow = new BrowserWindow({icon: iconPath, 
                                  webPreferences: {
                                  contextIsolation: true
                                }})
  mainWindow.maximize()
  mainWindow.loadURL(`http://localhost:8000/`)
  mainWindow.on('close', event => {
    mainWindow = null
  })
}

app.on('ready', main)