<template>
<b-card @click.prevent="toggleItem($event,data.id)" :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.id)}" no-body>
    <router-link :to="`manage-category?id=${data.id}`" class="d-flex">
        <img :src="data.file?uploadUrl+data.file:'../../../assets/img/bg.jpg'" class="list-thumbnail responsive border-0" :alt="data.title" style="width: 160px !important;height: 90px;"/>
    </router-link>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
        <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
            <router-link :to="`manage-category?id=${data.id}`" class="w-40 w-sm-100">
                <p class="list-item-heading mb-0 truncate">{{data.title}}</p>
            </router-link>
            <!-- <div class="w-15 w-sm-100 text-center">
                <b-badge v-if="parseInt(data.checked_qrcode)" pill :variant="parseInt(data.checked_qrcode)?'success':'primary'">QR Code checked</b-badge>
            </div> -->
            <div class="w-15 w-sm-100 text-center">
                <b-badge pill :variant="parseInt(data.published)?'success':'danger'">{{parseInt(data.published)?'Published':'Draft'}}</b-badge>
            </div>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.updated_at | moment('from')}}</p>
        </div>
        <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
            <b-form-checkbox :checked="selectedItems.includes(data.id)" class="itemCheck mb-0" />
        </div>
    </div>
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
