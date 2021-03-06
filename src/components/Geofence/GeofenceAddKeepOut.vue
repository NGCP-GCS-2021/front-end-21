<template>
     <v-btn @click="addKeepOut" color="primary"> Add Keep Out </v-btn>
</template>

<script>
export default {
    methods: {
        addKeepOut() {
            this.$emit('addKeepOut');
        }
    }
}
</script>