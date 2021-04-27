<template>
<b-card @click.prevent="toggleItem($event,data.id)" :class="{'active' : selectedItems.includes(data.id)}" no-body>
    <div class="position-relative">
        <router-link :to="`manage-workout?id=${data.id}`" class="w-40 w-sm-100 h-30 h-sm-75">
            <!-- <img :src="data.file?uploadUrl+data.file:'../../../assets/img/bg.jpg'" class="card-img-top" :alt="data.title" /> -->
            <div style="position: relative;width: 100%; padding-top: 56.25%;height: 0; overflow: hidden;">
                <img :src="data.file?uploadUrl+data.file:'../../../assets/img/bg.jpg'" class="card-img-top" :alt="data.title" style="position:absolute; top: 0;" />
            </div>
        </router-link>
        <b-badge pill :variant="parseInt(data.published)?'success':'danger'" class="position-absolute badge-top-left">{{parseInt(data.published)?'Published':'Draft'}}</b-badge>
    </div>
    <b-card-body>
        <b-row>
            <b-colxx xxs="2">
                <b-form-checkbox :checked="selectedItems.includes(data.id)" class="itemCheck mb-0" />
            </b-colxx>
            <b-colxx xxs="10" class="mb-3">
                <h6 class="mb-4 card-subtitle">{{data.title}}</h6>
                <p class="text-muted text-small mb-0 font-weight-light card-text">{{data.updated_at | moment('from')}}</p>
            </b-colxx>
        </b-row>
    </b-card-body>
</b-card>
</template>

<script>
import {uploadUrl} from '../../../constants/config';
export default {
    props: ['data', 'selectedItems'],
    data() {
        return {
            uploadUrl: uploadUrl
        }
    },
    methods: {
        toggleItem(event, itemId) {
            this.$emit('toggle-item', event, itemId)
        }
    }
}
</script>
