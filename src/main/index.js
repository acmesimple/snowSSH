'use strict'

import { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray } from 'electron'
const path = require('path')
if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
/**
*  Time:2019-11-19 11:41:31
*  Author:chebinbin
*  Description:窗口对象
**/
let windows = {
    url: (process.env.NODE_ENV === 'development' ? `http://localhost:9080#` : `file://${__dirname}/index.html#`),
    pages: {},
    create(page) {
        if (this.pages[page.name]) return// 同名页面不可重复创建
        this.pages[page.name] = page
        this.pages[page.name].handle = new BrowserWindow(page.info)
        this.pages[page.name].handle.loadURL(this.url + (page.url ? page.url : '/' + page.name))
    },
    close(pageName) {
        if (!this.pages[pageName]) return
        if (pageName == 'main') { // 主界面最小化
            this.pages[pageName].handle.hide()
        } else { // 子页面销毁
            this.pages[pageName].handle.close()
            delete this.pages[pageName]
        }
    },
    min(pageName) {
        this.pages[pageName].handle.minimize()
    }
}
ipcMain.on('min', (e, name) => {
    windows.min(name)
})
ipcMain.on('close', (e, name) => {
    windows.close(name)
})
ipcMain.on('createWindow', (e, data) => {
    windows.create(data)
})

// 主窗口配置
var mainWindow = {
    name: 'main',
    info: {
        width: 280,
        height: 600,
        minWidth: 200,
        maxWidth: 800,
        minHeight: 500,
        maxHeight: 700,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        }
    },
    url: '/'
}
let appTray
app.on('ready', () => {
    // 创建主窗口
    windows.create(mainWindow)
    // 创建系统托盘
    let trayMenuTemplate = [{
        label: '退出',
        click: function () {
            app.quit()
            globalShortcut.unregisterAll()
        }
    }]
    appTray= new Tray(path.join(__static + '/logo.png'))
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    appTray.setContextMenu(contextMenu)
    appTray.on('click', function () {
        windows.pages.main.handle.show()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('will-quit', function () {
    globalShortcut.unregisterAll()
})
app.on('activate', () => {
    if (windows.pages.main.handle === null) {
        windows.create(mainWindow)
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
