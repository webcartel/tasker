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
		tasksLog: [],
	},

	getters: {
		getTodayTaskTime: function(state) {
			let today = new Date();
			let year = today.getFullYear()
			let month = today.getMonth()
			let day = today.getDate()
			var day_start = new Date(year, month, day, 0, 0, 0, 0).getTime()
			var day_end = new Date(year, month, day, 23, 59, 59, 59).getTime()

			var log = state.tasksLog
			var spentIds = []

			var resultArr = []
			for (var i = 0; i < log.length; i++) {
				var logItem = log[i]
				if ( spentIds.indexOf(logItem.taskId) == -1 && logItem.startTime >= day_start && logItem.stopTime <= day_end ) {
					var taskObj = {}
					var summ = 0
					for (let i = 0; i < log.length; i++) {
						if ( logItem.taskId === log[i].taskId && log[i].startTime >= day_start && log[i].stopTime <= day_end ) {
							summ += log[i].stopTime - log[i].startTime
							console.log(summ)
							taskObj = { taskId: logItem.taskId, time: summ }
						}
					}
					resultArr.push(taskObj)
					spentIds.push(logItem.taskId)
				}
			}
			return resultArr
		},
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

		tasksLogSave( state, { tasksLogItem } ) {
			state.tasksLog.push(tasksLogItem)
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

		tasksLogSave({ commit }, tasksLogItem) {
			commit('tasksLogSave', { tasksLogItem: tasksLogItem })
		},
	},

	plugins: [vuexLocalStorage.plugin],
})

export default store