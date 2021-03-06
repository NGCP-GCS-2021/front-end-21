<template>
     <v-btn @click="addKeepIn" color="primary"> Add Keep In </v-btn>
</template>

<script>
export default {
    methods: {
        addKeepIn() {
            this.$emit('addKeepIn');
        }
    }
}
</script>