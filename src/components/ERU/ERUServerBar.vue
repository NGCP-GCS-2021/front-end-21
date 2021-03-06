<template>
    <div>
        <v-row class="" >
              <v-col :cols="12">
                <v-progress-linear 
                  color="green"
                  class="px-1"
                  v-model="value"
                  :active="show"
                  :indeterminate="query"
                  :query="true"
                  >
                </v-progress-linear>
              </v-col>
          </v-row>
          <v-row class="px-3 pb-1">
            <h4>Data Updated {{ }} ago</h4>
          </v-row>
    </div>
</template>
<script>
export default {
    data () {
      return {
        value: 0,
        query: false,
        show: true,
        interval: 0,
      }
    },

    mounted () {
      this.queryAndIndeterminate()
    },

    beforeDestroy () {
      clearInterval(this.interval)
    },

    methods: {
      queryAndIndeterminate () {
        this.query = true
        this.show = true
        this.value = 0
      },
    },
  }
</script>
