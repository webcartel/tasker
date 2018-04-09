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
			let indexToRemove = state.projects.findIndex(obj => obj.projectId == itemId)
			state.projects.splice(indexToRemove , 1)
		}
	},

	actions: {
		createProject({ commit }, projectData) {
			commit('set', { type: 'projects', item: projectData })
		},

		deleteProject({ commit }, projectId) {
			commit('delete', { itemId: projectId })
		}
	},
})

export default store