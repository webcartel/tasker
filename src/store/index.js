import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		projects: []
	},

	mutations: {
		set( state, { type, item } ) {
			state.projects.push(item)
		},

		delete( state, { itemId } ) {

		}
	},

	actions: {
		createProject({ commit }, projectData) {
			commit('set', { type: 'projects', item: projectData })
		}
	},
})

export default store