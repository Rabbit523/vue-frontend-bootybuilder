<template>
<b-card @click.prevent="toggleItem($event,data.id)" :class="{'active' : selectedItems.includes(data.id)}" no-body>
    <div class="position-relative">
        <router-link :to="`manage-exercise?id=${data.id}`" class="w-40 w-sm-100 h-30 h-sm-75">
            <!-- <img :src="data.file?uploadUrl+data.file:'../../../assets/img/bg.jpg'" class="card-img-top" :alt="data.title" /> -->
            <!-- <div style="position: relative;width: 100%; padding-top: 56.25%;height: 0; overflow: hidden;">
                <img :src="data.file?uploadUrl+data.file:'../../../assets/img/bg.jpg'" class="card-img-top" :alt="data.title" style="position:absolute; top: 0;" />
            </div> -->
            <div :style="'position: relative;\
                      width: 100%; \
                      padding-top: 120%;\
                      height: 0; \
                      overflow: hidden;\
                      background-color: lightgrey;\
                      border-top-right-radius: 0.75rem;\
                      border-top-left-radius: 0.75rem;\
                      background-image: url('+(data.thumbnail ? uploadUrl + data.thumbnail : '../../../assets/img/bg.jpg')+'); \
                      background-size: cover;\
                      background-repeat: no-repeat;\
                      background-position: center;\
                      background-color: black;\
                      display: flex;\
                      align-items: center;\
                      justify-content: center;\
                      font-size: xxx-large;\
                      '"
                      @mouseenter="showPlayBtn=true"
                      @mouseleave="showPlayBtn=false"
                      >

                  <b-button v-if="showPlayBtn" variant="primary" style="margin-top: -120%" @click="playVideo(data.file, data.format_id)" v-on:click.prevent v-b-modal.modalbasic>Play Video</b-button>
                  <!-- <span class="icon success" style="margin-top: -50%;">
                    <div @click="playVideo(data.file)" v-on:click.prevent v-b-modal.modalbasic>
                      <i class="simple-icon-control-play"></i>
                    </div>
                  </span> -->
                </div>
        </router-link>
        <b-badge pill :variant="parseInt(data.published)?'success':'danger'" class="position-absolute badge-top-left">{{parseInt(data.published)?'Published':'Draft'}}</b-badge>
    </div>
    <b-card-body>
        <b-row>
            <b-colxx xxs="2">
                <b-form-checkbox :checked="selectedItems.includes(data.id)" class="itemCheck mb-0" />
            </b-colxx>
            <b-colxx xxs="10" class="mb-3">
                <h6 class="mb-4 card-subtitle">{{data.title}}</h6>
                <p class="text-muted text-small mb-0 font-weight-light card-text">{{data.updated_at | moment('from')}}</p>
            </b-colxx>
        </b-row>
    </b-card-body>
</b-card>
</template>

<script>
import VideoPlayer from "../../../components/Common/VideoPlayer";
import {uploadUrl} from '../../../constants/config';
export default {
    components: {
        "video-player": VideoPlayer,
    },
    props: ['data', 'selectedItems', 'playVideo'],
    data() {
        return {
            uploadUrl: uploadUrl,
            showPlayBtn: false
        }
    },
    methods: {
        toggleItem(event, itemId) {
            this.$emit('toggle-item', event, itemId)
        },
    }
}
</script>
