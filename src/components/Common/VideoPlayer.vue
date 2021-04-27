<template >
<div v-if="!onError" data-vjs-player>
    <video ref="myPlayer" :poster="poster" :class="`${className}`"></video>
</div>
<img v-else src="../../assets/img/bg.jpg" class="responsive border-0"/>
</template>

<script>
import videojs from 'video.js'

export default {
    props: ['autoplay', 'controls', 'controlBar','poster', 'sources', 'className'],
    data() {
        return {
            player: '',
            onError: false
        }
    },
    methods: {
        setSource(src) {
            if(src[0].src == null) {
                this.onError = true;
            } else {
                this.onError = false;
                if(this.player == '') {
                    setTimeout(() => {
                        this.player = videojs(this.$refs.myPlayer, {
                        autoplay: this.autoplay ? true : false,
                        controlBar: this.controlBar ,
                        controls: this.controls ? true : false,
                        sources: src,
                        errorDisplay: false
                    }, () => {
                    });
                    }, 500);
                } else {
                    this.player.src(src);
                }
            }
        }
    },
    mounted() {
        if(this.sources[0].src == null
            || this.sources[0].src == 'http://localhost:9090/null'
            || this.sources[0].src == ''
            || this.sources[0].src == 'http://localhost:9090/' )
        {
            this.onError = true;
        } else {
            this.player = videojs(this.$refs.myPlayer, {
                autoplay: this.autoplay ? true : false,
                controlBar: this.controlBar ,
                controls: this.controls ? true : false,
                sources: this.sources,
                errorDisplay: false
            }, () => {
            });
            this.player.on('error', (e) => {
                e.stopImmediatePropagation();
                // this.onError = true;
            });
        }
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    }
}
</script>
