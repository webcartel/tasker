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
		userId: 1,
		currentProjectId: null,
		tasks: [],
	},

	mutations: {
		// Projects
		setProject( state, { type, item } ) {
			state.projects.push(item)
		},

		setProjectList( state, { listItems } ) {
			state.projects = listItems
		},

		deleteProject( state, { itemId } ) {
			let indexToRemove = state.projects.findIndex(obj => obj.id == itemId)
			state.projects.splice(indexToRemove , 1)
		},

		setCurrentProject( state, { currentProjectId } ) {
			state.currentProjectId = currentProjectId
		},


		// Tasks
		setTask( state, { type, item } ) {
			state.tasks.push(item)
		},

		setTaskList( state, { listItems } ) {
			state.tasks = listItems
		},

		deleteTask( state, { itemId } ) {
			let indexToRemove = state.tasks.findIndex(obj => obj.id == itemId)
			state.tasks.splice(indexToRemove , 1)
		},
	},

	actions: {
		// Projects
		createProject({ commit }, projectData) {
			commit('setProject', { type: 'projects', item: projectData })
		},

		setProjectList({ commit }, listItems) {
			commit('setProjectList', { listItems: listItems })
		},

		deleteProject({ commit }, projectId) {
			commit('deleteProject', { itemId: projectId })
		},

		setCurrentProject({ commit }, projectId) {
			commit('setCurrentProject', { itemId: projectId })
		},


		// Tasks
		createTask({ commit }, taskData) {
			commit('setTask', { type: 'tasks', item: taskData })
		},

		setTaskList({ commit }, listItems) {
			commit('setTaskList', { listItems: listItems })
		},

		deleteTask({ commit }, taskId) {
			commit('deleteTask', { itemId: tasksId })
		},
	},

	plugins: [vuexLocalStorage.plugin],
})

export default store