import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		projects: []
	},

	mutations: {
		set( state, { type, items } ) {
			state[type] = items
		}
	},

	actions: {
		createProject({ commit }, projectData) {
			commit('set', { type: 'projects', items: projectData })
		}
	},
})

export default store