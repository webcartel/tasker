// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import { Dialog,
	Input,
	ColorPicker,
	Select,
	Option,
	Container,
	Main,
	Header,
	Footer,
	Aside,
	Row,
	Col,
	Card,
	Loading,
	MessageBox,
	Notification,
	Button,
	ButtonGroup,
} from 'element-ui'
import locale from 'element-ui/lib/locale'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import router from './router'

Vue.use(Dialog)
Vue.use(Input)
Vue.use(ColorPicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Container)
Vue.use(Main)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Aside)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Loading)
Vue.use(Button)
Vue.use(ButtonGroup)
locale.use(lang)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})
