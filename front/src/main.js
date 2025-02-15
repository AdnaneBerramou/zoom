import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueRouter from 'vue-router'
import Routes from './routes'

export const bus = new Vue();

Vue.use(VueRouter);
Vue.prototype.$http = axios;

const router = new VueRouter({
	routes: Routes,
	mode: 'history'
});


new Vue({
	el: '#app',
	render: h => h(App),
	router: router
})