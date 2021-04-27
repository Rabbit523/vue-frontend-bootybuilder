<template>
<b-card @click.prevent="toggleItem($event,data.id)" :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.id)}" no-body>
    <router-link :to="`?p=${data.id}`" class="d-flex w-15">
        <!-- <img :src="data.file?uploadUrl+data.file:'../../../assets/img/bg.jpg'" class="list-thumbnail responsive border-0" :alt="data.title" /> -->
        <div :style="'position: relative;\
                      width: 100%; \
                      padding-top: 120%;\
                      height: 0; \
                      border-radius: 0.75rem; \
                      overflow: hidden; \
                      background-image: url('+(data.thumbnail ? uploadUrl + data.thumbnail : '../../../assets/img/bg.jpg')+'); \
                      background-size: cover; \
                      background-repeat: no-repeat;\
                      background-position: center;\
                      background-color: black;\
                      display: flex;\
                      align-items: center;\
                      justify-content: center;\
                      font-size: xx-large;'"
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
                    v-b-modal.modalCategory
                  >
                    Play Video
                  </b-button>
                  <!-- <video-player ref="myPlayer"
                    class-name="video-js side-bar-video"
                    style="position: absolute; top: 0;height: 100%;"
                    :autoplay="false"
                    :sources="[{ src: data.file?uploadUrl+data.file:null, type: 'video/mp4'}]"
                    disabled /> -->
                </div>
    </router-link>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero w-80">
        <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
            <router-link :to="`?p=${data.id}`" class="w-40 w-sm-100">
                <p class="list-item-heading mb-0 truncate">{{data.title}}</p>
            </router-link>
            <p class="mb-0 text-muted text-small w-30 w-sm-100">Series : {{data.series}}</p>
            <p class="mb-0 text-muted text-small w-30 w-sm-100">Repetitions : {{data.repetitions}}</p>
            <!-- <div class="w-15 w-sm-100">
                <b-badge pill :variant="data.standalone?'success':'warning'">{{data.standalone?'Checked':'Unchecked'}}</b-badge>
                <b-badge pill :variant="data.format_id?'success':'warning'">{{data.format_id?'4:3':'16:9'}}</b-badge>
                <b-badge pill :variant="data.published?'success':'warning'">{{data.published?'Published':'Draft'}}</b-badge>
            </div> -->
        </div>
        <div class="custom-control custom-checkbox pl-1 align-self-center w-20 text-center">
            <!-- <b-form-checkbox :checked="selectedItems.includes(data.id)" class="itemCheck mb-0" /> -->
            <b-button v-if="!added" variant="outline-primary" class="mr-2" @click="()=>{addExercise(data);}">Add</b-button>
            <b-button v-else variant="danger" class="mr-2" @click="()=>{removeExercise(data.id); }">Remove</b-button>
        </div>
    </div>
</b-card>
</template>

<script>
import VideoPlayer from "../../../../components/Common/VideoPlayer";
import {uploadUrl} from '../../../../constants/config';
export default {
    components: {
        "video-player": VideoPlayer,
    },
    props: ['data', 'selectedItems', 'addExercise', 'removeExercise', 'isAdded', 'playVideo'],
    data() {
        return {
            added: this.$props.isAdded,
            uploadUrl: uploadUrl,
            showPlayBtn: false
        }
    },
    watch: {
        isAdded() {
            this.added = this.$props.isAdded;
        }
    },
    methods: {
        toggleItem(event, itemId) {
            this.$emit('toggle-item', event, itemId)
        },
    }
}
</script>
