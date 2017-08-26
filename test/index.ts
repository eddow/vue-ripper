import * as Vue from 'vue'
import 'vue-property-decorator'
import './column.vue'
import ripper from 'vue-ripper'
Vue.use(ripper);

import App from './app.vue'

new Vue({
	el: 'app',
	components: {App}
});
