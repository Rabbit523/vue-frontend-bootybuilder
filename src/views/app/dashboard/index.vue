<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.dashboard')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <template v-if="isLoad">
      <b-row>
          <b-colxx lg="4" sm="12" class="mb-4">
              <gradient-with-radial-progress-card icon="simple-icon-control-play" :title="`${data.exercises.published} Exercises`" detail="Published Exercises" :percent="data.exercises.published*100/data.exercises.total" :progressText="`${data.exercises.published}/${data.exercises.total}`" />
          </b-colxx>
          <b-colxx lg="4" sm="12" class="mb-4">
              <gradient-with-radial-progress-card icon="simple-icon-grid" :title="`${data.categories.published} Categories`" detail="Published Categories" :percent="data.categories.published*100/data.categories.total" :progressText="`${data.categories.published}/${data.categories.total}`" />
          </b-colxx>
          <b-colxx lg="4" sm="12" class="mb-4">
              <gradient-with-radial-progress-card icon="simple-icon-calendar" :title="`${data.workouts.published} Workouts`" detail="Published Workouts" :percent="data.workouts.published*100/data.workouts.total" :progressText="`${data.workouts.published}/${data.workouts.total}`" />
          </b-colxx>
      </b-row>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { apiUrl } from "../../../constants/config";
import GradientWithRadialProgressCard from './GradientWithRadialProgressCard';

export default {
  components: {
    'gradient-with-radial-progress-card': GradientWithRadialProgressCard,
  },
  data() {
    return {
      data: {
        exercises: {
          total: 0,
          published: 0
        },
        workouts: {
          total: 0,
          published: 0
        },
        categories: {
          total: 0,
          published: 0
        }
      },
      isLoad: false

    }
  },
  methods: {
    loadItems() {
      this.isLoad = false;
      var token = localStorage.getItem('token');

      axios
        .get(apiUrl+'/statistics', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }})
        .then(response => {
          return response.data;
        })
        .then(res => {
          this.data = res;
          this.isLoad = true;
        });
      
    },
  },
  mounted() {
    this.loadItems();
  }
}
</script>