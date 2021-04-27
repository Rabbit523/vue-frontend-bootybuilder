<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.add-new-workout')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>

    <template v-if="isLoad">
      <b-row>
        <b-colxx xxs="12" md="12" xl="8" class="col-left">
          <b-card class="mb-4" title="Workout">
              <b-form-group label-cols="2" horizontal :label="$t('forms.workout-title')">
                <b-form-input v-model="title" :placeholder="$t('forms.workout-title')"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="2" horizontal :label="$t('forms.workout-desc')">
                <b-form-textarea v-model="description" :placeholder="$t('forms.workout-desc')" />
              </b-form-group>
          </b-card>
          <b-row class="mb-2" style="padding-left: 20px; padding-right: 20px;">
            <div class="w-100 d-flex justify-content-between align-items-center">
              <h3>Exercises</h3>
              <div>
                <b-button v-if="weekdays.length" class="mb-1 block mr-1" variant="secondary" @click="onDeleteTab()">Delete Tab</b-button>
                <b-button class="mb-1 block mr-1" variant="danger" @click="onAddNewWeekday()">Add Weekday</b-button>
                <b-button class="mb-1 block" variant="primary" @click="onAddNewVideo()">Add Video</b-button>
              </div>
            </div>
          </b-row>
          <b-card v-if="weekdays.length" class="mb-4" no-body>
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
              <b-modal id="modalEditExercise" ref="modalEditExercise" title="Edit Tab Name">
                  <b-form-group label-cols="2" horizontal label="Tab Name">
                    <b-form-input v-model="exercise_name" placeholder="Exercise Name"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" horizontal label="Series">
                    <b-form-input v-model="exercise_series" placeholder="Series"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" horizontal label="Repetitions">
                    <b-form-input v-model="exercise_repetitions" placeholder="Repetitions"></b-form-input>
                  </b-form-group>
                  <template slot="modal-footer">
                      <b-button variant="primary" @click="updateExercise('modalEditExercise')" class="mr-1">Change</b-button>
                      <b-button variant="secondary" @click="hideModal('modalEditExercise')">Cancel</b-button>
                  </template>
              </b-modal>
              <b-tab ref="tabs" v-for="(tag, index) in weekdays" :key="index" :title="tag.title">
                <b-row>
                  <add-exercise-item
                    v-for="(exercise, i) in tag.exercises"
                    :key="i"
                    :data="exercise"
                    :editExercise="onEditExercise"
                    :removeExercise="onRemoveExercise"
                    :playVideo="playVideo"
                    :index="i"
                  >
                  </add-exercise-item>
                </b-row>
              </b-tab>
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
              </div>
              <!-- <img class="" style="margin:0;padding:0;display:block;width: 100%; height: 150px;cursor:pointer;" :src="imgPath" /> -->
              <b-file v-model="imgFile" class="mt-3" accept="image/*"></b-file>
              <b-button v-if="imgPath!=''" variant="primary" class="mt-3 float-right" @click="removeImage()">Remove</b-button>
              <!-- <input type="file" @change="onFileInput($event)"> -->

              <!-- <b-button xl="6" class="mb-1 mt-3 flex-fill float-right" variant="danger">Delete</b-button> -->
            </b-card-body>
          </b-card>
          <b-card class="mb-4" no-body>
            <b-card-body>
              <b-card-title>More options</b-card-title>
              <!-- <b-checkbox switch>For QR Code?</b-checkbox> -->
              <b-row class="align-items-center m-0">
                  <switches v-model="subscribed" theme="custom" color="primary" class="mb-2">For QR Code?</switches>
                  <a class="mb-2 ml-3" style="font-size: 18px;">Subscribed?</a>
              </b-row>
              <b-row v-if="subscribed" class="m-0 w-100 mt-3">
                <b-form-group label="Product ID" class="w-100">
                  <b-form-input v-model="productID" placeholder="Product ID" />
                </b-form-group>
              </b-row>
              <b-row class="m-0 w-100 mt-3">
                <b-form-group label="Amount Weeks Program" class="w-100">
                  <b-form-input v-model="amount_weeks_program" placeholder="Amount Weeks Program" />
                </b-form-group>
              </b-row>
            </b-card-body>
          </b-card>

          <b-card class="mb-4" no-body>
            <b-card-body>
              <b-card-title>Category</b-card-title>
              <b-row class="m-0 w-100 mt-3">
                <b-form-group label="New Category" class="w-100">
                  <b-form-input v-model="category_name" placeholder="Category Name" />
                </b-form-group>
              </b-row>
              <b-button variant="primary" class="float-right" @click="createNewCategory()">Create New</b-button>
              <b-button variant="danger" class="float-right mr-1" @click="deleteCategory()">Delete Category</b-button>
              <b-row class="m-0 w-100 mt-3">
                <b-form-group label="Choose a category" class="w-100">
                  <v-select v-model="category" label="title" :options="categories" :dir="direction" />
                </b-form-group>
              </b-row>
              
            </b-card-body>
          </b-card>

          <b-card class="mb-4" no-body>
            <b-card-body>
              <b-row class="align-items-center m-0">
                  <switches v-model="has_timer" theme="custom" color="primary" class="mb-2"></switches>
                  <a class="mb-2 ml-3" style="font-size: 18px;">Has Timer?</a>
              </b-row>
              <b-row v-if="has_timer" class="m-0 w-100 mt-3">
                <b-col>
                  <b-card-title>Level 1</b-card-title>
                  <b-form-group label="Work" class="w-100">
                    <b-form-input v-model="level1_work" placeholder="Work" />
                  </b-form-group>
                  <b-form-group label="Rest" class="w-100">
                    <b-form-input v-model="level1_rest" placeholder="Rest" />
                  </b-form-group>
                  <b-form-group label="Rounds" class="w-100">
                    <b-form-input v-model="level1_rounds" placeholder="Rounds" />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-card-title>Level 2</b-card-title>
                  <b-form-group label="Work" class="w-100">
                    <b-form-input v-model="level2_work" placeholder="Work" />
                  </b-form-group>
                  <b-form-group label="Rest" class="w-100">
                    <b-form-input v-model="level2_rest" placeholder="Rest" />
                  </b-form-group>
                  <b-form-group label="Rounds" class="w-100">
                    <b-form-input v-model="level2_rounds" placeholder="Rounds" />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-card-title>Level 3</b-card-title>
                  <b-form-group label="Work" class="w-100">
                    <b-form-input v-model="level3_work" placeholder="Work" />
                  </b-form-group>
                  <b-form-group label="Rest" class="w-100">
                    <b-form-input v-model="level3_rest" placeholder="Rest" />
                  </b-form-group>
                  <b-form-group label="Rounds" class="w-100">
                    <b-form-input v-model="level3_rounds" placeholder="Rounds" />
                  </b-form-group>
                </b-col>
              </b-row>
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
import vSelect from "vue-select";

import "vue-select/dist/vue-select.css";

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
    "v-select": vSelect
  },
  data() {
    return {
      pageSizes: [4, 8, 12],
      isLoad: false,
      apiBase: apiUrl + "/get_workouts_1",
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
      weekdays: [],
      newTag: "",
      editTag: '',
      tabIndex: 0,
      showExercises: false,
      subscribed: false,
      has_timer: 0,
      imgPath: '',
      imgFile: null,
      exercise_name: '',
      exercise_series: 0,
      exercise_repetitions: 0,
      editing_exercise_id: -1,
      editing_exercise_index: -1,
      amount_weeks_program: 0,
      level1_work: 30,
      level1_rest: 30,
      level1_rounds: 3,
      level2_work: 30,
      level2_rest: 30,
      level2_rounds: 3,
      level3_work: 30,
      level3_rest: 30,
      level3_rounds: 3,
      category_name: null,
      category: {
        id: null,
        title: null,
      },
      categories: [],
      addedExercises: [],
      productID: '',
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

    publish(is_published) {
      if(this.title == '') {
        this.addNotification(
          "error filled",
          "Adding new workout",
          "You haven't input the workout title. Please input workout title."
        );
        return;
      }
      if(this.description == '') {
        this.addNotification(
          "error filled",
          "Adding new workout",
          "You haven't input the workout description. Please input workout description."
        );
        return;
      }
      var token = localStorage.getItem("token");
      var formdata = new FormData();
      formdata.append('title', this.title);
      formdata.append('description', this.description);
      if(this.imgFile) {
        formdata.append('file', this.imgFile, this.imgFile.name);
      }
      formdata.append('subscribed', this.subscribed? '1' : '0');
      formdata.append('has_timer', this.has_timer?'1':'0');
      formdata.append('weekdays', JSON.stringify(this.weekdays));
      formdata.append('published', is_published);
      formdata.append('amount_weeks_program', this.amount_weeks_program);
      formdata.append('product_id',this.productID);

      if(this.category.id) {
        formdata.append('category', this.category.id);
      }

      formdata.append('level1_work', this.level1_work);
      formdata.append('level1_rest', this.level1_rest);
      formdata.append('level1_rounds', this.level1_rounds);
      formdata.append('level2_work', this.level2_work);
      formdata.append('level2_rest', this.level2_rest);
      formdata.append('level2_rounds', this.level2_rounds);
      formdata.append('level3_work', this.level3_work);
      formdata.append('level3_rest', this.level3_rest);
      formdata.append('level3_rounds', this.level3_rounds);

      this.isLoad=false;

      axios.post(apiUrl+'/add_workouts', formdata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => response.data)
      .then(res => {
        this.$router.push('workouts');
        this.isLoad=true;
      })
    },

    onAddNewWeekday() {
      this.weekdays.push({
        id: -1,
        title: 'Day '+(this.weekdays.length + 1),
        exercises: []
      });
    },

    onAddNewTag(tag) {
      if(tag != '') {
        this.$swal({
          title: 'Are you sure?',
          text: "A new tag will be added to this workout!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, add it!'
        })
        .then((result) => {
          if (result.value) {
            this.weekdays.push({
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
      this.imgPath = data;
    },

    changeTagName(refname) {
      this.weekdays[this.tabIndex].title = this.editTag;
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
          this.weekdays.splice(this.tabIndex, 1);
          this.weekdays.forEach((item, index) => {
            item.title = 'Day '+(index+1);
          });
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
          "There's no weekdays to insert new videos. Please add weekdays first."
        );
      } else {
        this.showExercises = true;
      }
    },

    loadCategories() {
      var token = localStorage.getItem("token");

      axios
        .post(apiUrl+'/workout_categories', null, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return response.data;
        })
        .then(res => {
          this.categories = res.categories;
        });
    },

deleteCategory(){
      if (!this.category || !this.category.id){
        this.$swal(
          'Incomplete!',
          'Category should be selected to continue.',
          'warning'
        );
        return;
      } 

      this.$swal({
          title: 'Are you sure?',
          text: "The category will be deleted!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        })
        .then((result) => {
          if (result.value) {
            var token = localStorage.getItem("token");
            var formdata = new FormData();
            formdata.append('id', this.category.id);
            axios.post(apiUrl+'/delete_workout_category', formdata,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            })
            .then(response => response.data)
            .then(res => {
              this.$swal(
                'Added!',
                'A new tag has been deleted.',
                'success'
              );
              this.categories = this.categories.filter(d => d.id != this.category.id);
              this.category = {
                id: null,
                title: null
              };
            });
          }
        });
    },
    
    createNewCategory() {
      if (!this.category_name || !this.category_name.trim()){
        this.$swal(
          'Incomplete!',
          'Category name should be filled to continue.',
          'warning'
        );
        return;
      } 

      this.$swal({
          title: 'Are you sure?',
          text: "A new category will be created!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, do it!'
        })
        .then((result) => {
          if (result.value) {
            var token = localStorage.getItem("token");
            var formdata = new FormData();
            formdata.append('title', this.category_name);
            axios.post(apiUrl+'/create_workout_category', formdata,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            })
            .then(response => response.data)
            .then(res => {
              this.$swal(
                'Added!',
                'A new tag has been added.',
                'success'
              );
              if (res.created) {
                this.categories.push(res.category);
              }
            });
          }
        });
    },

    loadItems() {
      this.isLoad = false;
      this.loadCategories();

      var token = localStorage.getItem("token");

      axios
        .get(this.apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return response.data;
        })
        .then(res => {
          this.total = res.total;
          this.items = res.data;
          this.perPage = res.per_page;
          this.selectedItems = [];
          this.lastPage = res.last_page;          
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
      var filtered = this.weekdays[this.tabIndex].exercises.filter((item) => {return item.id == exercise_data.id;});
      if(!filtered.length) {
        this.weekdays[this.tabIndex].exercises.push(exercise_data);
        this.addedExercises = this.weekdays[this.tabIndex].exercises;
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
          this.weekdays[this.tabIndex].exercises.forEach((exercise, index) => {
            if(exercise.id == id) {
              ind = index;
            }
          });
          this.weekdays[this.tabIndex].exercises.splice(ind, 1);
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
      this.weekdays[this.tabIndex].exercises[this.editing_exercise_index].title = this.exercise_name;
      this.weekdays[this.tabIndex].exercises[this.editing_exercise_index].series = this.exercise_series;
      this.weekdays[this.tabIndex].exercises[this.editing_exercise_index].repetitions = this.exercise_repetitions;

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
    playVideo(url, format=1) {
      console.log('url = ', url);
      this.playUrl = url;
      this.format_id=format;
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
    apiUrl() {
      return `${this.apiBase}?sort=${this.sort.column}&page=${this.page}&per_page=${this.perPage}&search=${this.search}`;
    },
  },
  watch: {
    search() {
      this.page = 1;
    },
    apiUrl() {
      this.loadItems();
    },
    imgFile() {
      if(this.imgFile != null) {
        var url = URL.createObjectURL(this.imgFile);
        this.imgPath = url;
      }
    },
    tabIndex() {
      if(this.tabIndex >= 0) {
        this.addedExercises = this.weekdays[this.tabIndex].exercises;
      }
    }
  },
  mounted() {
    this.loadItems();
  }
};
</script>
