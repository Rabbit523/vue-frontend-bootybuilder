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
          <b-card class="mb-4" title="Category">
              <b-form-group label-cols="2" horizontal :label="$t('forms.category-title')">
                <b-form-input v-model="title" :placeholder="$t('forms.category-title')"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="2" horizontal :label="$t('forms.category-desc')">
                <b-form-textarea v-model="description" :placeholder="$t('forms.category-desc')" />
              </b-form-group>
          </b-card>
          <b-row class="mb-2" style="padding-left: 20px; padding-right: 20px;">
            <div class="w-100 d-flex justify-content-between align-items-center">
              <h3>Exercises</h3>
              <div>
                <b-button v-if="tags.length" v-b-modal.modalEditTab variant="secondary" class="mr-1" @click="onEditTag()">Edit Tag</b-button>
                <b-button v-if="tags.length" class="mr-1" variant="danger" @click="onDeleteTab()">Delete Tag</b-button>
                <b-button variant="primary" @click="onAddNewVideo()">Add Video</b-button>
              </div>
            </div>
          </b-row>
          <b-card v-if="tags.length" class="mb-4" no-body>
            <b-tabs card no-fade v-model="tabIndex">
              <b-modal id="modalEditTab" ref="modalEditTab" title="Edit Tab Name">
                  <b-form-group label-cols="2" horizontal label="Tab Name">
                    <b-form-input v-model="editTag" placeholder="Tab Name"></b-form-input>
                  </b-form-group>
                  <template slot="modal-footer">
                      <b-button variant="primary" @click="changeTagName('modalEditTab')" class="mr-1">Change</b-button>
                      <b-button variant="secondary" @click="hideModal('modalEditTab')">Cancel</b-button>
                  </template>
              </b-modal>
              <b-modal id="modalEditExercise" ref="modalEditExercise" title="Edit Exercise">
                  <b-form-group label-cols="2" horizontal label="Name">
                    <b-form-input v-model="exercise_name" placeholder="Exercise Name"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" horizontal label="Series">
                    <b-form-input v-model="exercise_series" placeholder="Series"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" horizontal label="Repetitions">
                    <b-form-input v-model="exercise_repetitions" placeholder="Repetitions"></b-form-input>
                  </b-form-group>
                  <template slot="modal-footer">
                      <b-button variant="primary" @click="updateExercise('modalEditExercise')" class="mr-1">Update</b-button>
                      <b-button variant="secondary" @click="hideModal('modalEditExercise')">Cancel</b-button>
                  </template>
              </b-modal>
              <b-modal id="modalAddSubtag" ref="modalAddSubtag" title="Add Subtag">
                <b-form-group label-cols="2" horizontal label="Subtag Name">
                  <b-form-input v-model="curSubtag" placeholder="Subtag Name"></b-form-input>
                </b-form-group>
                <template slot="modal-footer">
                    <b-button variant="primary" @click="addSubtagName('modalAddSubtag')" class="mr-1">Add</b-button>
                    <b-button variant="secondary" @click="hideModal('modalAddSubtag')">Cancel</b-button>
                </template>
              </b-modal>
              <b-modal id="modalEditSubtag" ref="modalEditSubtag" title="Edit Subtag">
                <b-form-group label-cols="2" horizontal label="Subtag Name">
                  <b-form-input v-model="curSubtag" placeholder="Subtag Name"></b-form-input>
                </b-form-group>
                <template slot="modal-footer">
                    <b-button variant="primary" @click="editSubtagName('modalEditSubtag')" class="mr-1">Update</b-button>
                    <b-button variant="secondary" @click="hideModal('modalEditSubtag')">Cancel</b-button>
                </template>
              </b-modal>
              <b-tab ref="tabs" v-for="(tag, index) in tags" :key="index" :title="tag.title">
                <b-checkbox v-model="tag.has_subtags" @change="onHasSubtagsChanged($event)" style="position: absolute; top: 10px; right: 30px;">Has sub tags</b-checkbox>
                <b-nav v-if="tag.has_subtags" ref="subtags" pills>
                  <div v-for="(subtag, ind) in tag.subtags" :key="ind">
                    <b-nav-item  :active="ind == curSubtagIndex" class="mr-1" @click="onClickSubtag(ind)">{{subtag.name}}</b-nav-item>
                  </div>
                  <b-nav-item-dropdown
                    text="Action"
                    right
                  >
                    <b-dropdown-item @click="onAddSubtag('modalAddSubtag')">Add New</b-dropdown-item>
                    <b-dropdown-item @click="onEditSubtag('modalEditSubtag')">Edit</b-dropdown-item>
                    <b-dropdown-item @click="onRemoveSubtag()">Remove</b-dropdown-item>
                  </b-nav-item-dropdown>
                </b-nav>

              </b-tab>
              <template v-if="tags[tabIndex].has_subtags">
                <b-row v-if="tags[tabIndex].subtags.length" class="pl-5 pr-5 pb-3">
                    <add-exercise-item
                      v-for="(exercise, i) in tags[tabIndex].subtags[curSubtagIndex].exercises"
                      :key="i"
                      :data="exercise"
                      :editExercise="onEditExercise"
                      :removeExercise="onRemoveExercise"
                      :playVideo="playVideo"
                      :index="i"
                    >
                    </add-exercise-item>
                  </b-row>
              </template>
              <template v-else>
                <b-row v-if="tags[tabIndex].exercises" class="pl-5 pr-5 pb-3">
                  <add-exercise-item
                    v-for="(exercise, i) in tags[tabIndex].exercises"
                    :key="i"
                    :data="exercise"
                    :editExercise="onEditExercise"
                    :removeExercise="onRemoveExercise"
                    :playVideo="playVideo"
                    :index="i"
                  >
                  </add-exercise-item>
                </b-row>
              </template>
            </b-tabs>
          </b-card>
          <template v-if="showExercises">
            <b-card class="" no-body>
              <b-card-header class="mt-4 d-flex flex-row justify-content-between align-items-center" style="padding: 0px 28px 10px 28px;">
                <h3>Add Exercises</h3>
                <b-button class="mb-1 block" variant="danger" @click="showExercises=false">Close</b-button>
              </b-card-header>
              <b-card-body style="padding-top: 0;">
                <exercise-list
                  :addExercise="onAddExercise"
                  :removeExercise="onRemoveExercise"
                  :addedExercises="addedExercises"
                  :playVideo="playVideo"
                  ref="exercise_list">
                </exercise-list>
              </b-card-body>
            </b-card>
          </template>
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
                      padding-top: 56.25%;\
                      height: 0; \
                      overflow: hidden;\
                      background-color: lightgrey;\
                      background-image: url('+imgPath+');\
                      background-size: cover;'">
                  <!-- <img :src="imgPath" class="card-img-top" style="position:absolute; top: 0;" /> -->
              </div>
              <!-- <img class="" style="margin:0;padding:0;display:block;width: 100%; height: 150px;cursor:pointer;" :src="imgPath" /> -->
              <b-file v-model="imgFile" class="mt-3" accept="image/*"></b-file>
              <b-button v-if="imgPath!=''" variant="primary" class="mt-3 float-right" @click="removeImage()">Remove</b-button>
              <!-- <input type="file" @change="onFileInput($event)"> -->

              <!-- <b-button xl="6" class="mb-1 mt-3 flex-fill float-right" variant="danger">Delete</b-button> -->
            </b-card-body>
          </b-card>
          <!-- <b-card class="mb-4" no-body>
            <b-card-body>
              <b-card-title>More options</b-card-title>
              <b-row class="align-items-center m-0">
                  <switches v-model="qr_code" theme="custom" color="primary" class="mb-2">For QR Code?</switches>
                  <a class="mb-2 ml-3" style="font-size: 18px;">For QR Code?</a>
              </b-row>
            </b-card-body>
          </b-card> -->
          <b-card class="mb-4" no-body>
            <b-card-body>
              <b-card-title>Tags</b-card-title>
              <b-input v-model="newTag" />
              <b-button class="mt-3 float-right" variant="primary" @click="onAddNewTag(newTag)">Add New</b-button>
            </b-card-body>
          </b-card>
        </b-colxx>
      </b-row>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>

    <b-modal id="modalCategory" ref="modalCategory" title="Preview Video" body-class="p-0" header-class="p-3" hide-footer>
      <video-player ref="myPlayer"
        class-name="video-js side-bar-video video-preview"
        :style="'width: 100%;border-radius: 0;'+(format_id==1?'':'height: 625px;')"
        :autoplay="false"
        :controls="true"
        :sources="[{ src: uploadUrl+playUrl, type: 'video/mp4'}]" />
    </b-modal>
  </div>
</template>

<script>
// import SingleLightbox from "../../../components/Pages/SingleLightbox";
import VideoPlayer from "../../../components/Common/VideoPlayer";
import RecentPost from "../../../components/Common/RecentPost";
import VueDropzone from "vue2-dropzone";
import axios from "axios";
import { apiUrl, uploadUrl } from "../../../constants/config";
import ListPageListing from "./ListPageListing";
import ExerciseList from "../components/ExerciseList";
import AddExerciseItem from "../components/AddExerciseItem";
import Switches from 'vue-switches'

export default {
  components: {
    // "single-lightbox": SingleLightbox,
    "video-player": VideoPlayer,
    "recent-post": RecentPost,
    "vue-dropzone": VueDropzone,
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
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailHeight: 160,
        maxFilesize: 1,
        previewTemplate: this.dropzoneTemplate(),
        acceptedFiles: "image/*",
        headers: {
          "My-Awesome-Header": "header value"
        }
      },
      tags: [],
      newTag: "",
      editTag: '',
      tabIndex: 0,
      showExercises: false,
      qr_code: true,
      imgPath: '',
      imgFile: null,
      exercise_name: '',
      exercise_series: 0,
      exercise_repetitions: 0,
      editing_exercise_id: -1,
      editing_exercise_index: -1,
      addedExercises: [],
      curSubtag: '',
      curSubtagIndex: 0,
      playUrl: '',
      uploadUrl: uploadUrl,
      format_id: 1
    };
  },
  methods: {
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `;
    },

    removeImage() {
      this.imgPath='';
      this.imgFile=null;
    },

    onEditTag() {
      this.editTag = this.tags[this.tabIndex].title;
    },

    publish(is_published) {
      if(this.title == '') {
        this.addNotification(
          "error filled",
          "Adding new category",
          "You haven't input the category title. Please input category title."
        );
        return;
      }
      if(this.description == '') {
        this.addNotification(
          "error filled",
          "Adding new category",
          "You haven't input the category description. Please input category description."
        );
        return;
      }
      var token = localStorage.getItem("token");
      var formdata = new FormData();
      formdata.append('title', this.title);
      formdata.append('description', this.description);
      if(this.imgFile != null) {
        formdata.append('file', this.imgFile, this.imgFile.name);
      }
      formdata.append('qr_code', this.qr_code? '1' : '0');
      formdata.append('tags', JSON.stringify(this.tags));
      formdata.append('published', is_published);
      formdata.append('id', this.$route.query.id);

      this.isLoad=false;

      axios.post(apiUrl+'/update_categories', formdata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => response.data)
      .then(res => {
        this.$router.push('categories');
        this.isLoad=true;
      })
    },

    onAddNewTag(tag) {
      if(tag != '') {
        this.$swal({
          title: 'Are you sure?',
          text: "A new tag will be added to this category!",
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
              has_subtags: false,
              subtags: [],
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
      this.imgPath = data;
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
          this.tabIndex--;
          this.tabIndex = this.tabIndex < 0 ? 0 : this.tabIndex;
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
      if (this.$refs.tabs == undefined
        || (this.tags[this.tabIndex].has_subtags && !this.tags[this.tabIndex].subtags)
        || (this.tags[this.tabIndex].has_subtags && !this.tags[this.tabIndex].subtags.length )) {
        this.addNotification(
          "error filled",
          "Adding new video",
          "There's no tags to insert new videos. Please add tags first."
        );
      } else {
        this.showExercises = true;
      }
    },

    loadItems(id) {
      this.isLoad = false;
      var token = localStorage.getItem("token");

      axios
        .get(apiUrl+'/get_category_content?id='+id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return response.data;
        })
        .then(res => {
          console.log('category content = ', res);
          this.title = res.data.title;
          this.description = res.data.description;
          this.imgPath = res.data.file? uploadUrl + res.data.file : null;
          this.qr_code = parseInt(res.data.checked_qrcode);
          this.tags = res.tags ? res.tags : [];
          this.addedExercises = res.tags && res.tags.length > 0? (res.tags[0].has_subtags ? (res.tags[0].subtags.length ? res.tags[0].subtags[0].exercises : null) : res.tags[0].exercises) : null;
          this.isLoad = true;
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
      if(!this.tags[this.tabIndex].has_subtags) {
        var filtered = this.tags[this.tabIndex].exercises.filter((item) => {return item.id == exercise_data.id;});
        if(!filtered.length) {
          this.tags[this.tabIndex].exercises.push(exercise_data);
          this.addedExercises = this.tags[this.tabIndex].exercises;
        }
      } else {
        var filtered = this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises.filter((item) => {return item.id == exercise_data.id;});
        if(!filtered.length) {
          this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises.push(exercise_data);
          this.addedExercises = this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises;
        }
      }
    },
    onRemoveExercise(id){
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
          var ind = -1;
          this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises.forEach((exercise, index) => {
            if(exercise.id == id) {
              ind = index;
            }
          });
          this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises.splice(ind, 1);
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
      this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises[this.editing_exercise_index].title = this.exercise_name;
      this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises[this.editing_exercise_index].series = this.exercise_series;
      this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises[this.editing_exercise_index].repetitions = this.exercise_repetitions;

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
    onAddSubtag(refname) {
      this.curSubtag = '';
      this.$refs[refname].show();
    },
    onEditSubtag(refname) {
      this.curSubtag = this.tags[this.tabIndex].subtags[this.curSubtagIndex].name;
      this.$refs[refname].show();
    },
    addSubtagName(refname) {
      if(this.curSubtag == '') {
        this.addNotification(
          "error filled",
          "Adding new subtag",
          "Please input subtag name correctly."
        );
        return;
      }
      if(this.tags[this.tabIndex].subtags == undefined) {
        this.tags[this.tabIndex].subtags = [{
          name: this.curSubtag,
          exercises: []
        }];
      } else {
        this.tags[this.tabIndex].subtags.push({
          name: this.curSubtag,
          exercises: []
        })
      }
      this.curSubtag = '';
      this.$forceUpdate();
      this.$refs[refname].hide();
    },
    editSubtagName(refname) {
      this.tags[this.tabIndex].subtags[this.curSubtagIndex].name = this.curSubtag;
      this.$refs[refname].hide();
      // console.log('tags = ', this.tags);
    },
    onClickSubtag(ind) {
      this.curSubtagIndex=ind;
      this.addedExercises = this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises;
    },
    onRemoveSubtag() {
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
          this.tags[this.tabIndex].subtags.splice(this.curSubtagIndex, 1);
          this.curSubtagIndex--;
          if(this.curSubtagIndex < 0) {
            this.curSubtagIndex = 0;
          }
          this.$swal(
            'Deleted!',
            'Your subtag has been deleted.',
            'success'
          );
        }
      });
    },
    playVideo(url, format=1) {
      console.log('url = ', url);
      this.playUrl = url;
      this.format_id=format;
    },
    onHasSubtagsChanged(event) {
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
          if(this.tags[this.tabIndex].has_subtags) {
            this.tags[this.tabIndex].subtags = [];
          } else {
            this.tags[this.tabIndex].exercises = [];
          }
          this.addedExercises = [];
          this.showExercises = false;
        } else {
          this.tags[this.tabIndex].has_subtags = !this.tags[this.tabIndex].has_subtags;
        }
      });
    }
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
    imgFile() {
      var url = URL.createObjectURL(this.imgFile);
      this.imgPath = url;
    },
    tabIndex() {
      this.curSubtagIndex = 0;
      if(this.tabIndex >= 0 && this.tags[this.tabIndex].subtags.length) {
        this.addedExercises = this.tags[this.tabIndex].subtags[this.curSubtagIndex].exercises;
      } else {
        this.addedExercises = [];
      }
    }
  },
  mounted() {
    this.loadItems(this.$route.query.id);
  }
};
</script>
