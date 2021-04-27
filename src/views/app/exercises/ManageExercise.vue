<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="title" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>

    <template v-if="isLoad">
      <b-row>
        <b-colxx xxs="12" md="12" xl="8" class="col-left">
          <b-card class="mb-4" title="Exercise">
              <b-form-group label-cols="2" horizontal :label="$t('forms.exercise-title')">
                <b-form-input v-model="title" :placeholder="$t('forms.exercise-title')"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="2" horizontal :label="$t('forms.exercise-desc')">
                <b-form-textarea v-model="description" :placeholder="$t('forms.exercise-desc')" />
              </b-form-group>
          </b-card>
            <b-card class="mb-4" no-body>
              <b-card-body>
                <b-card-title>Exercise video</b-card-title>
                <div :style="'position: relative;\
                        width: 100%; \
                        padding-top: '+(format_id==1?'56.25':'120')+'%;\
                        height: 0; \
                        overflow: hidden;\
                        border-radius: 0.75rem; \
                        background-color: lightgrey;\
                        background-repeat: no-repeat;\
                        background-position: center;\
                        background-size: contain;'">
                    <video-player ref="myPlayer" class-name="video-js side-bar-video"
                      style="position: absolute; top: 0;height: 100%"
                      :autoplay="false" :controls="true"
                      :controlBar="{pictureInPictureToggle: true}"
                      :sources="videoSource" />
                </div>
                <b-file v-model="videoFile" class="mt-3" accept="video/*"></b-file>
              </b-card-body>
            </b-card>
        </b-colxx>
        <b-colxx xxs="12" md="12" xl="4" class="col-left">
          <b-card class="mb-4" title="Status & Visibility">
            <div class="d-flex flex-row">
              <b-button xl="6" class="mb-1 mr-2 flex-fill" variant="outline-primary" @click="publish(0)">Save Draft</b-button>
              <b-button xl="6" class="mb-1 flex-fill" variant="primary" @click="publish(1)">Publish</b-button>
            </div>
          </b-card>
          <b-card class="mb-4" no-body>
            <b-card-body>
              <b-card-title>Featured Image</b-card-title>
              <!-- <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone> -->

              <div :style="'position: relative;\
                      width: 100%; \
                      padding-top: '+(format_id==1?'56.25':'120')+'%;\
                      height: 0; \
                      overflow: hidden;\
                      background-color: lightgrey;\
                      background-repeat: no-repeat;\
                      background-position: center;\
                      background-image: url('+thumbUrl+');\
                      background-size: contain;'">
                      <canvas ref="canvas" allowTaint='true' style="display: fixed; width: 100%; height: 100%; position: absolute;" width="336" height="189"></canvas>
                      <div v-if="isLoadingThumb" class="loading" style="position: absolute;"></div>
                  <!-- <img :src="imgPath" class="card-img-top" style="position:absolute; top: 0;" /> -->
              </div>
              <!-- <img class="" style="margin:0;padding:0;display:block;width: 100%; height: 150px;cursor:pointer;" :src="imgPath" /> -->
              <b-file v-model="thumbFile" class="mt-3 mr-1" accept="image/*"></b-file>
                <!-- <b-button variant="outline-primary" class="mt-3 float-right" @click="captureImage()" :disabled="isLoadingThumb">Capture</b-button> -->
                <b-button v-if="thumbUrl!=''" variant="primary" class="mt-3 float-right" @click="removeImage()">Remove</b-button>
              <!-- <b-button class="w-30" size="sm">Delete</b-button> -->
              <!-- <input type="file" @change="onFileInput($event)"> -->

              <!-- <b-button xl="6" class="mb-1 mt-3 flex-fill float-right" variant="danger">Delete</b-button> -->
            </b-card-body>
          </b-card>
          <b-card class="mb-4" no-body>
            <b-card-body>
              <b-card-title>More options</b-card-title>
              <!-- <b-checkbox switch>For QR Code?</b-checkbox> -->
              <b-row class="m-0 w-100 mt-3">
                <b-form-group label="Series" class="w-100">
                  <b-form-input v-model="series" placeholder="Series" />
                </b-form-group>
              </b-row>
              <b-row class="m-0 w-100 mt-3">
                <b-form-group label="Repetitions" class="w-100">
                  <b-form-input v-model="repetitions" placeholder="Repetitions" />
                </b-form-group>
              </b-row>
              <b-row class="m-0 w-100 mt-3">
                <b-form-group label="Duration" class="w-100">
                  <b-form-input v-model="duration" placeholder="Duration" />
                </b-form-group>
              </b-row>
              <b-row class="align-items-center m-0" style="display:none;">
                  <switches v-model="standalone" theme="custom" color="primary" class="mb-2">Standalone?</switches>
                  <a class="mb-2 ml-3" style="font-size: 18px;">Standalone?</a>
              </b-row>
              <b-row class="m-0 w-100 mt-3">
                <b-button-group class="mb-2">
                  <b-button variant="primary" @click="format_id=2" :pressed="format_id==2">4:5</b-button>
                  <b-button variant="primary" @click="format_id=1" :pressed="format_id==1">16:9</b-button>
                </b-button-group>
              </b-row>
            </b-card-body>
          </b-card>
        </b-colxx>
      </b-row>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
  </div>
</template>

<script>
// import SingleLightbox from "../../../components/Pages/SingleLightbox";
import VideoPlayer from "../../../components/Common/VideoPlayer";
import RecentPost from "../../../components/Common/RecentPost";
import axios from "axios";
import { apiUrl, uploadUrl } from "../../../constants/config";
import ListPageListing from "./ListPageListing";
import ExerciseList from "../components/ExerciseList";
import AddExerciseItem from "../components/AddExerciseItem";
import Switches from 'vue-switches';
import { getThumbnails } from 'video-metadata-thumbnails';

export default {
  components: {
    // "single-lightbox": SingleLightbox,
    "video-player": VideoPlayer,
    "recent-post": RecentPost,
    "list-page-listing": ListPageListing,
    "exercise-list": ExerciseList,
    "add-exercise-item": AddExerciseItem,
    'switches': Switches,
  },
  data() {
    return {
      pageSizes: [4, 8, 12],
      isLoad: false,
      displayMode: "thumb",
      sort: {
        column: "title",
        label: "description"
      },
      page: 1,
      perPage: 4,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      selectedItems: [],
      title: "",
      description: "",
      tags: [],
      newTag: "",
      editTag: '',
      tabIndex: 0,
      showExercises: false,
      qr_code: true,
      videoPath: '',
      videoFile: null,
      exercise_name: '',
      exercise_series: 0,
      exercise_repetitions: 0,
      editing_exercise_id: -1,
      editing_exercise_index: -1,

      series: 0,
      repetitions: 0,
      duration: 10,
      standalone: 0,
      format_id: 1,
      videoSource: [],
      thumbUrl: '',
      thumbFile: null,
      isLoadingThumb: false
    };
  },
  methods: {
    dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {type:mime});
    },

    captureImage() {
      // console.log('myplayer = ', this.$refs.myPlayer.$refs.myPlayer);
      this.$refs.canvas.getContext('2d').drawImage(this.$refs.myPlayer.$refs.myPlayer, 0, 0, 336, 189);
      var snapshot = this.$refs.canvas.toDataURL('image/png');
      this.thumbFile = this.dataURLtoFile(snapshot, 'thumbnail.png');
    },

    removeImage() {
      this.thumbUrl='';
      this.thumbFile=null;
    },

    publish(is_published) {
      if(this.title == '') {
        this.addNotification(
          "error filled",
          "Adding new exercise",
          "You haven't input the exercise title. Please input exercise title."
        );
        return;
      }
      if(this.description == '') {
        this.addNotification(
          "error filled",
          "Adding new exercise",
          "You haven't input the exercise description. Please input exercise description."
        );
        return;
      }
      var token = localStorage.getItem("token");
      var formdata = new FormData();
      formdata.append('id', this.$route.query.id);
      formdata.append('title', this.title);
      formdata.append('description', this.description);
      if(this.videoFile != null) {
        formdata.append('file', this.videoFile, this.videoFile.name);
      }
      if(this.thumbFile) {
        formdata.append('thumbnail', this.thumbFile, this.thumbFile.name);
      }
      formdata.append('series', this.series);
      formdata.append('repetitions', this.repetitions);
      formdata.append('video_length', this.duration);
      formdata.append('standalone', this.standalone ? 1 : 0);
      formdata.append('format_id', this.format_id);
      formdata.append('published', is_published);

      this.isLoad=false;

      axios.post(apiUrl+'/update_exercises_1', formdata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => response.data)
      .then(res => {
        this.$router.push('exercises');
        this.isLoad=true;
      })
    },

    onAddNewTag(tag) {
      if(tag != '') {
        this.$swal({
          title: 'Are you sure?',
          text: "A new tag will be added to this exercise!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, add it!'
        })
        .then((result) => {
          if (result.value) {
            this.tags.push({
              id: -1,
              title: tag,
              exercises: []
            });
            this.editTag = tag;
            this.newTag = '';
            this.$swal(
              'Added!',
              'A new tag has been added.',
              'success'
            );
          }
        });
      }

    },

    uploadImage() {
    },

    onFileInput(event) {
      const data = URL.createObjectURL(event.target.files[0]);
      this.videoPath = data;
    },

    changeTagName(refname) {
      this.tags[this.tabIndex].title = this.editTag;
      this.hideModal(refname);
    },

    hideModal (refname) {
      this.$refs[refname].hide();
    },

    onDeleteTab() {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      .then((result) => {
        if (result.value) {
          var id = this.tags[this.tabIndex].id;
          this.tags.splice(this.tabIndex, 1);
          if(id >= 0) {
            var token = localStorage.getItem("token");
            axios.get(apiUrl+'/delete_tag?tag_id='+id, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
          }
          this.$swal(
            'Deleted!',
            'Your tag has been deleted.',
            'success'
          );
        }
      });
    },

    addNotification(
      type = "success",
      title = "This is Notify Title",
      message = "This is Notify Message,<br>with html."
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false });
    },

    onAddNewVideo() {
      if (this.$refs.tabs == undefined) {
        this.addNotification(
          "error filled",
          "Adding new video",
          "There's no tass to insert new videos. Please add tags first."
        );
      } else {
        this.showExercises = true;
      }
    },

    loadItems(id) {
      this.isLoad = false;
      var token = localStorage.getItem("token");

      axios
        .get(apiUrl+'/get_exercise_content?id='+id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return response.data;
        })
        .then(res => {
          this.title = res.data.title;
          this.description = res.data.description;
          this.videoPath = uploadUrl + res.data.file;
          this.thumbUrl = res.data.thumbnail ? uploadUrl + res.data.thumbnail : '';
          this.series = parseInt(res.data.series);
          this.repetitions = parseInt(res.data.repetitions);
          this.duration = parseInt(res.data.video_length);
          this.standalone = parseInt(res.data.standalone);
          this.format_id = parseInt(res.data.format_id);
          this.videoSource = [{ src: this.videoPath, type: 'video/mp4'}]
          this.isLoad = true;


          if(this.$refs.myPlayer) {
            this.$refs.myPlayer.setSource(this.videoSource);
          }
        });
    },

    changeDisplayMode(displayType) {
      this.displayMode = displayType;
    },
    changePageSize(perPage) {
      this.page = 1;
      this.perPage = perPage;
    },
    changeOrderBy(sort) {
      this.sort = sort;
    },
    searchChange(val) {
      this.search = val;
      this.page = 1;
    },

    selectAll(isToggle) {
      if (this.selectedItems.length >= this.items.length) {
        if (isToggle) this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map(x => x.id);
      }
    },
    keymap(event) {
      switch (event.srcKey) {
        case "select":
          this.selectAll(false);
          break;
        case "undo":
          this.selectedItems = [];
          break;
      }
    },
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },
    toggleItem(event, itemId) {
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.items;
        var start = this.getIndex(itemId, itemsForToggle, "id");
        var end = this.getIndex(
          this.selectedItems[this.selectedItems.length - 1],
          itemsForToggle,
          "id"
        );
        itemsForToggle = itemsForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );
        this.selectedItems.push(
          ...itemsForToggle.map(item => {
            return item.id;
          })
        );
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId);
        } else this.selectedItems.push(itemId);
      }
    },
    handleContextMenu(vnode) {
      if (!this.selectedItems.includes(vnode.key)) {
        this.selectedItems = [vnode.key];
      }
    },
    onContextMenuAction(action) {
      // console.log(
      //   "context menu item clicked - " + action + ": ",
      //   this.selectedItems
      // );
    },
    changePage(pageNum) {
      this.page = pageNum;
    },
    onAddExercise(exercise_data) {
      var filtered = this.tags[this.tabIndex].exercises.filter((item) => {return item.id == exercise_data.id;});
      if(!filtered.length) {
        this.tags[this.tabIndex].exercises.push(exercise_data);
      }
    },
    onRemoveExercise(ind){
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      .then((result) => {
        if (result.value) {
          this.tags[this.tabIndex].exercises.splice(ind, 1);
          this.$swal(
            'Deleted!',
            'Your exercise has been deleted.',
            'success'
          );
        }
      });
    },
    onEditExercise(id, index, name, series, repetitions) {
      this.editing_exercise_id = id;
      this.editing_exercise_index = index;
      this.exercise_name = name;
      this.exercise_series = series;
      this.exercise_repetitions = repetitions;
    },
    updateExercise(refname) {
      this.tags[this.tabIndex].exercises[this.editing_exercise_index].title = this.exercise_name;
      this.tags[this.tabIndex].exercises[this.editing_exercise_index].series = this.exercise_series;
      this.tags[this.tabIndex].exercises[this.editing_exercise_index].repetitions = this.exercise_repetitions;

      var token = localStorage.getItem("token");
      axios.post(apiUrl+'/update_exercises', {
        'id': this.editing_exercise_id,
        'title': this.exercise_name,
        'series': this.exercise_series,
        'repetitions': this.exercise_repetitions
      },{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => response.data)
      .then(res => {
        this.hideModal(refname);
        this.$refs.exercise_list.loadItems();
        // this.loadItems(this.$route.query.id);
      });
    },
  },
  computed: {
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isAnyItemSelected() {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      );
    },
  },
  watch: {
    search() {
      this.page = 1;
    },
    videoFile() {
      var url = URL.createObjectURL(this.videoFile);
      if(url != null) {
        this.videoPath = url;
        this.videoSource = [{src: this.videoPath, type: 'video/mp4'}];
        this.$refs.myPlayer.setSource(this.videoSource);
        this.isLoadingThumb = true;

        var video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(this.videoFile);

        getThumbnails(url, {
          quality: 0.6,
          start: 0,
          end: 0,
        }).then(res => {
          // console.log(res);
          this.thumbUrl = URL.createObjectURL(res[0].blob);
          this.thumbFile = new File([res[0].blob], 'thumbnail.png');
          this.isLoadingThumb = false;
        });
      }
    },
    thumbFile() {
      var url = URL.createObjectURL(this.thumbFile);
      this.thumbUrl = url;
    },
  },
  mounted() {
    this.loadItems(this.$route.query.id);
  }
};
</script>
