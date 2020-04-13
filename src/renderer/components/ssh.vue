<template>
    <div :class="'bg-'+bg" class="content">
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
        <form class="padding text-lg" @submit="exec">
            <pre id="list" v-html="list"></pre>
            <input v-model.trim="cmd[cmdIndex]" style="background:rgba(0,0,0,0)" autofocus onblur="this.focus()">
        </form>
        <div class="padding"></div>
    </div>
</template>
<style>
    #list {
        display: inline !important;
        line-height: 30px;
    }

    .content {
        height: 100%;
        overflow-y: scroll;
        /*scroll-behavior: smooth;*/
    }
</style>

<script>
    // ssh
    import path from 'path'
    import { remote } from 'electron'
    import fs from 'fs'

    export default {
        data() {
            return {
                bg: 'cyan',
                list: '',
                cmd: [],
                cmdIndex: 0,
                stream: false
            }
        },
        mounted() {
            const that = this
            const ac = require('../assets/acme.js')
            ac.makeDraggable('.head')
            // 连接ssh服务器
            this.sshConn()
            // Up快捷键处理程序
            this.$electron.remote.globalShortcut.register('Up', () => {
                if (that.cmdIndex > 0) that.cmdIndex--
            })
            this.$electron.remote.globalShortcut.register('Down', () => {
                if (that.cmdIndex < that.cmd.length) that.cmdIndex++
            })
        },
        destroyed: () => {
            this.$electron.remote.globalShortcut.unregisterAll()
        },
        methods: {
            ipc(e) {
                this.$electron.ipcRenderer.send(e.target.dataset.act, 'ssh')
            },
            exec(e) {
                e.preventDefault()// 阻止@submit刷新页面
                if (!this.cmd[this.cmdIndex]) return
                if (this.cmdIndex < this.cmd.length - 1) { this.cmd.push(this.cmd[this.cmdIndex]) }
                this.stream.write(this.cmd[this.cmdIndex] + '\n')// 执行命令
                this.cmdIndex = this.cmd.length
            },
            scrollBottom() {
                this.$nextTick(() => {
                    var cont = document.querySelector('.content')
                    cont.scrollTop += (cont.scrollHeight - cont.offsetHeight - cont.scrollTop)
                })
            },
            sshConn() {
                const that = this
                let k = this.$route.params.k;
                const sshCli = require('ssh2').Client
                const ssh = new sshCli()
                // 读取配置文件
                var confPath = path.join(path.dirname(remote.app.getPath('exe')), '/conf.json')
                fs.exists(confPath, function (exists) {
                    if (exists) {
                        var conf = JSON.parse(fs.readFileSync(confPath))
                        if (conf.bg && conf.server) {
                            that.bg = conf.bg
                            that.server = conf.server[k]
                            //ssh链接
                            ssh.on('ready', function () {
                                ssh.shell((err, stream) => {
                                    if (err) throw err
                                    that.stream = stream
                                    stream.on('close', (code, signal) => {
                                        that.sshConn()// 重新连接
                                    }).on('data', (data) => {
                                        that.list += data.toString().replace(/\[[0-9;]*[a-zA-Z]/g, '')
                                        that.scrollBottom()
                                    }).stderr.on('data', (data) => {
                                        that.list += data.toString().replace(/\[[0-9;]*[a-zA-Z]/g, '')
                                        that.scrollBottom()
                                    })
                                })
                            }).connect(that.server)
                        }
                    }
                })


            }
        }
    }
</script>