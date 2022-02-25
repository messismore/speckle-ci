import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#A600FF',
        accent: '#F4E04D',
        info: '#06AED5',
        success: '#06D6A0',
        error: '#DF2935',
      },
    },
  },
})
