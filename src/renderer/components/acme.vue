<template>
    <div :class="'bg-'+bg+' cont'">
        <div class="padding flex justify-between head fixed-top">
            <div class="flex align-center">
                <i class="cuIcon-titles"></i>
                {{name}}
            </div>
            <div class="i-lg" onclick="close()">
                <i class="cuIcon-move padding-xs" v-on:click="ipc" data-act='min'></i>
                <i class="cuIcon-close" v-on:click="ipc" data-act='close'></i>
            </div>
        </div>
        <div style="height:100rem"></div>

        <slot :slist="server"></slot>

        <div style="height:140rem"></div>
        <div class="cu-bar tabbar fixed-bottom solid-top">
            <router-link to="/" class="action hover">
                <i class="cuIcon-playfill"></i>Ssh
            </router-link>
            <router-link to="/Mdb" class="action hover">
                <i class="cuIcon-order"></i>Mdb
            </router-link>
            <div class="action hover" @click="web">
                <i class="cuIcon-search"></i>搜索
            </div>
        </div>
    </div>
</template>
<script>
    import path from 'path'
    import { remote } from 'electron'
    import fs from 'fs'
    export default {
        data() {
            return {
                bg: 'cyan',
                name: '车彬彬',
                server: {}
            }
        },
        mounted() {
            var ac = require('../assets/acme.js')
            ac.makeDraggable('.head')
            var that = this
            // 读取配置文件

            var confPath = path.join(path.dirname(remote.app.getPath('exe')), '/conf.json')
            fs.exists(confPath, function (exists) {
                if (exists) {
                    var conf = JSON.parse(fs.readFileSync(confPath))
                    if (conf.bg && conf.name && conf.server) {
                        that.bg = conf.bg
                        that.name = conf.name
                        that.server = conf.server
                    }
                }
            })
        },
        methods: {
            ipc(e) {
                this.$electron.ipcRenderer.send(e.target.dataset.act, 'main')
            },
            web() {
                var webWindow = {
                    name: 'web',
                    info: {
                        width: 1000,
                        height: 600,
                        frame: false,
                        transparent: true
                    }
                }
                this.$electron.ipcRenderer.send('createWindow', webWindow)
            }
        }
    }
</script>
<style>
    .cont {
        height: 100%;
    }
</style>