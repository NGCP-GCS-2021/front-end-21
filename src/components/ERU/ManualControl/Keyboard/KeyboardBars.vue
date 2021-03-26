<template>
    <div>
      <v-row style="padding-top:2%;">
        <v-col cols=1>
          <h1 class="font-weight-light text-center">X</h1>
        </v-col>
        <v-col cols=5 style="padding-right:0px;">
          <v-progress-linear
          v-model="a_power"
          color="primary"
          height="50"
          reverse
          >
          </v-progress-linear>
        </v-col>
        <v-col cols=5 style="padding-left:0px;">
          <v-progress-linear
          v-model="d_power"
          color="primary"
          height="50"
          >
          </v-progress-linear>
        </v-col>
      </v-row>
      <v-row style="padding-top:2%;">
        <v-col cols=1>
          <h1 class="font-weight-light text-center">Y</h1>
        </v-col>
        <v-col cols=5 style="padding-right:0px;">
          <v-progress-linear
          v-model="s_power"
          color="primary"
          height="50"
          reverse
          >
          </v-progress-linear>
        </v-col>
        <v-col cols=5 style="padding-left:0px;">
          <v-progress-linear
          v-model="w_power"
          color="primary"
          height="50"
          >
          </v-progress-linear>
        </v-col>
      </v-row>
    </div>
</template>
<script>
  export default {
    data: () => ({
      w_power: 0,
      s_power: 0,
      a_power: 0,
      d_power: 0,
    }),
    
    methods: {
      onKeyDownW() {
        this.w_power = 100;
      },
      onKeyDownS() {
        this.s_power = 100;
      },
      onKeyDownA() {
        this.a_power = 100;
      },
      onKeyDownD() {
        this.d_power = 100;
      },
      onKeyUpW() {
        this.w_power = 0;
      },
      onKeyUpA() {
        this.a_power = 0;
      },
      onKeyUpS() {
        this.s_power = 0;
      },
      onKeyUpD() {
        this.d_power = 0;
      },
    },
    mounted() {
      window.addEventListener('keydown', (e)=>{
      var key = e.which || e.keyCode;
      if (key === 87) {
        this.onKeyDownW();
      }
      });

      window.addEventListener('keydown', (e)=>{
      var key = e.which || e.keyCode;
      if (key === 83) {
        this.onKeyDownS();
      }
      });

      window.addEventListener('keydown', (e)=>{
      var key = e.which || e.keyCode;
      if (key === 65) {
        this.onKeyDownA();
      }
      });

      window.addEventListener('keydown', (e)=>{
      var key = e.which || e.keyCode;
      if (key === 68) {
        this.onKeyDownD();
      }
      });

      window.addEventListener('keyup', (e)=>{
      var key = e.which || e.keyCode;
      if (key === 87) {
        this.onKeyUpW();
      }
      });

      window.addEventListener('keyup', (e)=>{
      var key = e.which || e.keyCode;
      if (key === 83) {
        this.onKeyUpS();
      }
      });

      window.addEventListener('keyup', (e)=>{
      var key = e.which || e.keyCode;
      if (key === 65) {
        this.onKeyUpA();
      }
      });

      window.addEventListener('keyup', (e)=>{
      var key = e.which || e.keyCode;
      if (key === 68) {
        this.onKeyUpD();
      }
      });
    }
  }
</script>