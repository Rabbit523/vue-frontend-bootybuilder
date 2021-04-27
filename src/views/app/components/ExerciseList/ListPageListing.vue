<template>
  <div>
    <b-row key="thumb">
      <b-colxx xxs="12" class="mb-3" v-for="(item,index) in items" :key="index" :id="item.id">
        <thumb-list-item
          :key="item.id"
          :data="item"
          :selected-items="selectedItems"
          :addExercise="addExercise"
          :removeExercise="removeExercise"
          :isAdded="checkIsAdded(item.id)"
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
      <v-contextmenu-item @click="onContextMenuAction('add')">
        <i class="simple-icon-plus" />
        <span>Add</span>
      </v-contextmenu-item>
    </v-contextmenu>

  </div>
</template>
<script>
import ThumbListItem from "./ThumbListItem";
import VideoPlayer from "../../../../components/Common/VideoPlayer";
import {uploadUrl} from '../../../../constants/config';
export default {
  components: {
    "video-player": VideoPlayer,
    "thumb-list-item": ThumbListItem
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
    "onContextMenuAction",
    "addExercise",
    "removeExercise",
    "addedExercises",
    "playVideo"
  ],
  data() {
    return {
      playUrl: '',
      uploadUrl: uploadUrl
    }
  },
  methods: {
    checkIsAdded(id) {
      var isAdded = false;
      if(this.$props.addedExercises != null) {
        this.$props.addedExercises.forEach((item, index) => {
          if(item == null) {
            isAdded = false;
          } else {
            if(parseInt(id) == parseInt(item.id)) {
              isAdded = true;
            }
          }
        });
      }
      return isAdded;
    },
    linkGen(pageNum) {
      return "#page-" + pageNum;
    }
  }
};
</script>
