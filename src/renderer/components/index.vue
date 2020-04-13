<template>
    <acme>
        <div slot-scope="data" class="cu-list menu card-menu margin-top-xl">
            <div class="cu-item" v-for="(ser,k) in data.slist">
                <div class="content">
                    <i class="cuIcon-playfill"></i>
                    <span class="padding-left-sm">{{ser.name}}</span>
                </div>
                <div>
                    <span class="cu-tag line-white hover">Mdb</span>
                    <span class="cu-tag line-white hover">PM2</span>
                    <span class="cu-tag line-white hover" @click="ssh" :data-k="k">SSH</span>
                </div>
            </div>
        </div>
    </acme>
</template>

<script>
    import acme from '@/components/acme'
    export default {
        components: { acme },
        methods: {
            ssh(e) {
                let k = e.target.dataset.k
                let sshWindow = {
                    name: 'ssh',
                    info: {
                        width: 700,
                        height: 600,
                        frame: false,
                        transparent: true
                    },
                    url: "/ssh/" + k
                }
                this.$electron.ipcRenderer.send('createWindow', sshWindow)
            }
        }
    }
</script>