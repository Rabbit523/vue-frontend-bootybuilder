<template>
  <div>
    <b-row v-if="displayMode==='image'" key="image">
      <b-colxx
        sm="6"
        lg="4"
        xl="3"
        class="mb-3"
        v-for="(item,index) in items"
        :key="index"
        :id="item.id"
      >
        <image-list-item
          :key="item.id"
          :data="item"
          :selected-items="selectedItems"
          @toggle-item="toggleItem"
          v-contextmenu:contextmenu
          :playVideo="playVideo"
        />
      </b-colxx>
    </b-row>
    <b-row v-else-if="displayMode==='thumb'" key="thumb">
      <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
        <thumb-list-item
          :key="item.id"
          :data="item"
          :selected-items="selectedItems"
          @toggle-item="toggleItem"
          v-contextmenu:contextmenu
          :playVideo="playVideo"
        />
      </b-colxx>
    </b-row>
    <b-row v-if="lastPage>1">
      <b-colxx xxs="12">
        <b-pagination-nav
          :number-of-pages="lastPage"
          :link-gen="linkGen"
          :value="page"
          @change="(a)=>changePage(a)"
          :per-page="perPage"
          align="center"
        >
          <template v-slot:next-text>
            <i class="simple-icon-arrow-right" />
          </template>
          <template v-slot:prev-text>
            <i class="simple-icon-arrow-left" />
          </template>
          <template v-slot:first-text>
            <i class="simple-icon-control-start" />
          </template>
          <template v-slot:last-text>
            <i class="simple-icon-control-end" />
          </template>
        </b-pagination-nav>
      </b-colxx>
    </b-row>

    <v-contextmenu @contextmenu="handleContextMenu" ref="contextmenu">
      <v-contextmenu-item @click="onContextMenuAction('delete')">
        <i class="simple-icon-trash" />
        <span>Delete</span>
      </v-contextmenu-item>
    </v-contextmenu>

    <b-modal id="modalbasic" ref="modalbasic" title="Preview Video" body-class="p-0" header-class="p-3" hide-footer>
      <video-player ref="myPlayer"
        className="video-js side-bar-video video-preview"
        :style="'width: 100%;border-radius: 0;'+(format_id==1?'':'height: 625px;')"
        :autoplay="false"
        :controls="true"
        :sources="[{ src: uploadUrl+playUrl, type: 'video/mp4'}]" />
    </b-modal>
  </div>
</template>
<script>
import ImageListItem from "./ImageListItem";
import ThumbListItem from "./ThumbListItem";
import VideoPlayer from "../../../components/Common/VideoPlayer";
import {uploadUrl} from '../../../constants/config';
export default {
  components: {
    "image-list-item": ImageListItem,
    "thumb-list-item": ThumbListItem,
    "video-player": VideoPlayer,
  },
  props: [
    "displayMode",
    "items",
    "selectedItems",
    "toggleItem",
    "lastPage",
    "perPage",
    "page",
    "changePage",
    "handleContextMenu",
    "onContextMenuAction"
  ],
  data() {
    return {
      playUrl: '',
      uploadUrl: uploadUrl,
      format_id: 1
    }
  },
  methods: {
    linkGen(pageNum) {
      return "#page-" + pageNum;
    },
    playVideo(url, format=1) {

      this.playUrl = url;
      this.format_id = format;
    }
  }
};
</script>
