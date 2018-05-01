import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
})

const store = new Vuex.Store({
	state: {
		projects: [],
		userId: 1
	},

	mutations: {
		set( state, { type, item } ) {
			state.projects.push(item)
		},

		setProjectList( state, { listItems } ) {
			state.projects = listItems
		},

		delete( state, { itemId } ) {
			let indexToRemove = state.projects.findIndex(obj => obj.id == itemId)
			state.projects.splice(indexToRemove , 1)
		}
	},

	actions: {
		createProject({ commit }, projectData) {
			commit('set', { type: 'projects', item: projectData })
		},

		setProjectList({ commit }, listItems) {
			commit('setProjectList', { listItems: listItems })
		},

		deleteProject({ commit }, projectId) {
			commit('delete', { itemId: projectId })
		}
	},

	plugins: [vuexLocalStorage.plugin],
})

export default store