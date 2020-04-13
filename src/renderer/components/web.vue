<template>
    <div :class="bg" class="content">
        <!-- 顶部 -->
        <div class="flex justify-between padding head fixed-top solid-bottom">
            <div>
                <i class="cuIcon-title"></i>
            </div>
            <div>
                <i class="cuIcon-move padding-xs" @click="ipc" data-act='min'></i>
                <i class="cuIcon-close" @click="ipc" data-act='close'></i>
            </div>
        </div>
        <div class="padding"><i class="cuIcon-title"></i></div>
        <!-- 中部 -->
        <webview src="https://cn.bing.com/"></webview>
        <div class="padding"></div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                bg: 'bg-cyan'
            }
        },
        mounted() {
            var ac = require('../assets/acme.js')
            ac.makeDraggable('.head')
            // 注入css
            var webview = document.querySelector('webview')
            webview.addEventListener('dom-ready', e => {
                var webContents = webview.getWebContents()
                webview.insertCSS(`
                    .header,body{
                        background:rgba(0, 0, 0, 0)!important;
                    }
                    body::-webkit-scrollbar,#hp_bottomCell{display:none}
                `)
                webview.executeJavaScript(`
                    console.log('哈哈')
                `)

                webContents.on('new-window', (event, url) => {
                    event.preventDefault()
                    webview.loadURL(url)
                })
            })
            // 快捷键处理程序
            this.$electron.remote.globalShortcut.register('Left',function(){
                webview.goBack()
            })
            this.$electron.remote.globalShortcut.register('Right', () => {
                webview.goForward()
            })
        },
        destroyed:()=>{
            this.$electron.remote.globalShortcut.unregisterAll()
        },
        methods: {
            ipc(e) {
                this.$electron.ipcRenderer.send(e.target.dataset.act, 'web')
            }
        }
    }
</script>
<style>
    #list {
        display: inline !important;
        line-height: 30px;
    }

    webview {
        min-height: 100%;
        height: auto;
    }

    .content {
        height: 100%;
        overflow-y: scroll;
        /*scroll-behavior: smooth;*/
    }
</style>