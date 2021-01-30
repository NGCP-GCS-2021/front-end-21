import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#001947', //dark blue
          secondary: '#61a3ff', //light blue 
          accent: '#c9e7ff', //white blue
          error: '#460f2f', //burgundy red
        },
      },
    },
  })

export default new Vuetify({
});
