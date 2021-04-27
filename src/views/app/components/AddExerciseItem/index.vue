<template>
<b-col cols="4" class="mb-2" v-if="data">
    <b-card class="active" no-body>
        <div class="position-relative">
            <router-link :to="`?p=${data.id}`" class="w-40 w-sm-100">
                <!-- <img :src="data.file?data.file:'../../../assets/img/bg.jpg'" class="card-img-top" :alt="data.title" /> -->
                <div :style="'position: relative;\
                      width: 100%; \
                      padding-top: 120%;\
                      height: 0; \
                      overflow: hidden; \
                      border-top-right-radius: 0.75rem; \
                      border-top-left-radius: 0.75rem; \
                      background-image: url('+(data.thumbnail ? uploadUrl + data.thumbnail : '../../../assets/img/bg.jpg')+'); \
                      background-size: cover;\
                      background-repeat: no-repeat;\
                      background-position: center;\
                      background-color: black;\
                      display: flex;\
                      align-items: center;\
                      justify-content: center;\
                      font-size: xxx-large;'"
                  @mouseenter="showPlayBtn=true"
                  @mouseleave="showPlayBtn=false"
                >

                  <b-button
                    v-if="showPlayBtn"
                    variant="primary"
                    style="margin-top: -120%"
                    @click="playVideo(data.file, data.format_id)"
                    v-on:click.prevent
                    v-b-modal.modalCategory
                  >
                    Play Video
                  </b-button>
                  <!-- <video-player ref="myPlayer"
                    class-name="video-js side-bar-video card-img-top"
                    style="position: absolute; top: 0;height: 100%;"
                    :autoplay="false"
                    :sources="[{ src: data.file?uploadUrl+data.file:null, type: 'video/mp4'}]"
                    disabled /> -->
                </div>
            </router-link>
            <!-- <b-badge pill :variant="data.published?'success':'primary'" class="position-absolute badge-top-left">Published</b-badge> -->
        </div>
        <b-card-body style="padding: 0.75rem;">
            <b-row>
                <b-colxx xxs="10" class="mb-3">
                    <h6 class="mb-4 card-subtitle">{{data.title}}</h6>
                    <p class="text-muted text-small mb-0 font-weight-light card-text">Series : {{data.series}}</p>
                    <p class="text-muted text-small mb-0 font-weight-light card-text">Repetitions : {{data.repetitions}}</p>
                </b-colxx>
            </b-row>

            <div style="position: absolute;bottom: 30px;right: 10px;display: flex;font-size: 18px">
                <div v-b-modal.modalEditExercise class="glyph-icon simple-icon-pencil mr-2" style="cursor: pointer;" @click="onEdit()"></div>
                <div class="glyph-icon simple-icon-trash" style="cursor: pointer;" @click="onDelete()"></div>
            </div>
        </b-card-body>
    </b-card>
</b-col>
</template>

<script>
import VideoPlayer from "../../../../components/Common/VideoPlayer";
import {uploadUrl} from '../../../../constants/config';
export default {
    components: {
        "video-player": VideoPlayer,
    },
    props: ['data', 'selectedItems', 'editExercise', 'removeExercise', 'index', 'playVideo'],
    data() {
        return {
            uploadUrl: uploadUrl,
            showPlayBtn: false
        }
    },
    methods: {
        onEdit() {
            this.$props.editExercise(
                this.$props.data.id,
                this.$props.index,
                this.$props.data.title,
                this.$props.data.series,
                this.$props.data.repetitions,
            );
        },
        onDelete() {
            this.$props.removeExercise(
                this.$props.data.id
            );
        },

    },
    mounted() {
        // console.log('data = ', this.data);
    }
}
</script>
