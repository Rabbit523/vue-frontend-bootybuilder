<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('settings.header')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>

    <template v-if="isLoad">
      <b-row>
        <b-col class="col-left">
          <b-card class="mb-4" title="Workout Category">
              <b-form-group label-cols="2" horizontal :label="$t('settings.timer')">
                <b-form-input v-model="settings.timer" :placeholder="$t('settings.timer')"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="2" horizontal :label="$t('settings.no-timer')">
                <b-form-textarea v-model="settings.no_timer" :placeholder="$t('settings.no-timer')" />
              </b-form-group>
              <b-button class="mt-3 float-right" variant="primary" @click="save()">Save</b-button>
          </b-card>
        </b-col>
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
export default {
  components: {
  },
  data() {
    return {
      isLoad: false,
      settings: {
        timer: "Timer",
        no_timer: "No Timer"
      },
    };
  },
  methods: {
    save() {
      var token = localStorage.getItem("token");
      var formdata = new FormData();
      formdata.append('settings', JSON.stringify(this.settings));
      
      this.isLoad=false;

      axios.post(apiUrl+'/update_settings', formdata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => response.data)
      .then(res => {
        this.isLoad=true;
      });
    },
    loadData() {
      this.isLoad = false;
      var token = localStorage.getItem("token");

      axios
        .get(apiUrl+'/get_settings', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          return response.data;
        })
        .then(res => {
          this.settings = res;
          this.isLoad = true;
        });
    },
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.loadData();
  }
};
</script>
