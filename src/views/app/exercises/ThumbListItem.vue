<template>
<b-card @click.prevent="toggleItem($event,data.id)" :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.id)}" no-body>
    <router-link :to="`manage-exercise?id=${data.id}`" class="d-flex w-10">
        <!-- <img :src="data.file?uploadUrl+data.file:'../../../assets/img/bg.jpg'" class="list-thumbnail responsive border-0" :alt="data.title" style="width: 160px !important;height: 90px;"/> -->
        <div :style="'position: relative;\
                      width: 100%; \
                      padding-top: 120%;\
                      height: 0; \
                      border-radius: 0.75rem; \
                      background-image: url('+(data.thumbnail ? uploadUrl + data.thumbnail : '../../../assets/img/bg.jpg')+'); \
                      background-size: cover; \
                      background-repeat: no-repeat;\
                      background-position: center;\
                      background-color: black;\
                      display: flex;\
                      align-items: center;\
                      justify-content: center;\
                      font-size: xx-large;\
                      overflow: hidden;'"
                    @mouseenter="showPlayBtn=true"
                    @mouseleave="showPlayBtn=false"
                >
                  <b-button
                    v-if="showPlayBtn"
                    variant="primary"
                    size="sm"
                    style="margin-top: -120%"
                    @click="playVideo(data.file, data.format_id)"
                    v-on:click.prevent
                    v-b-modal.modalbasic
                  >
                      Play Video
                  </b-button>
                </div>
    </router-link>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
        <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
            <router-link :to="`manage-exercise?id=${data.id}`" class="w-30 w-sm-100">
                <p class="list-item-heading mb-0 truncate">{{data.title}}</p>
            </router-link>
            <p class="mb-0 text-muted text-small w-15 w-sm-100 text-center">SERIES: {{data.series}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100 text-center">REPETITIONS: {{data.repetitions}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100 text-center">VIEWS: {{data.views}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100 text-center">{{data.video_length}}s</p>
            <div class="w-15 w-sm-100 text-center">
                <b-badge pill :variant="parseInt(data.published)?'success':'danger'">{{parseInt(data.published)?'Published':'Draft'}}</b-badge>
            </div>
            <div class="w-10 w-sm-100 text-center">
                <b-badge pill variant="success">{{parseInt(data.format_id) == 1?'16:9':'4:5'}}</b-badge>
            </div>
            <p class="mb-0 text-muted text-small w-15 w-sm-100 text-center">{{data.updated_at | moment('from')}}</p>
        </div>
        <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
            <b-form-checkbox :checked="selectedItems.includes(data.id)" class="itemCheck mb-0" />
        </div>
    </div>
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
        }
    }
}
</script>
