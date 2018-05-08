<template lang="html">

    <div class="tasks">
        <el-row :gutter="20">

            <el-col :span="12">
                <el-card class="tasks-card">
                    <div slot="header" class="clearfix tasks-card-header">
                        <span class="title">Задачи</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="createTaskDialogVisible = true">Создать задачу</el-button>
                    </div>
                    <div class="tasks-card-body" v-loading="tasksCardLoading">
                        <el-input placeholder="Поиск" v-model="searchInput" class="input-with-select" clearable>
                            <el-select v-model="searchBy" slot="prepend" placeholder="Везде">
                                <el-option label="По ID" value="id"></el-option>
                                <el-option label="По имени" value="name"></el-option>
                                <el-option label="По тегам" value="tags"></el-option>
                            </el-select>
                        </el-input>
                        <div class="task-item" v-for="task in taskList">
                            <span class="color" v-bind:style="{ background: task.color }"></span>
                            <span class="name">{{ task.name }}</span>
                            <span v-if="currentTaskTime > 0 && runningTask === task.id">{{ hours }} {{ minutes }} {{ seconds }}</span>
                            <div class="button-group">
                                <div class="button" @click="runTimer(task.id)" v-if="runningTask != task.id">
                                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 5v14l11-7z"/>
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                    </svg>
                                </div>
                                <div class="button" @click="runTimer(task.id)" v-if="runningTask === task.id">
                                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                    </svg>
                                </div>
                                <router-link :to="{ name: 'tasksById', params: { task_id: task.id }}" class="button">
                                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                    </svg>
                                </router-link>
                                <div class="button" @click="editTask(task.id)">
                                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                    </svg>
                                </div>
                                <div class="button" @click="deleteTask(task.id)">
                                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card class="tasks-card">
                    <div slot="header" class="clearfix tasks-card-header">
                        <span>Активность</span>
                    </div>
                    <div class="log" v-for="logItem in tasksTimeLog">{{ logItem.taskId }} ---- {{ logItem.time }}</div>
                </el-card>
            </el-col>
        </el-row>

        <!-- dialogs -->
        <el-dialog :title="createTasktDialogTitle" :visible.sync="createTaskDialogVisible" width="30%">
            <el-input class="input" placeholder="Название задачи" v-model="taskNameInput" v-on:keyup.enter="createNewTask()" clearable autofocus></el-input>
            <div class="input">
                <el-color-picker v-model="taskColorInput" :predefine="predefineColors"></el-color-picker>
                <span>Выбор цвета</span>
            </div>
            <el-input type="textarea" :rows="5" placeholder="Please input" v-model="taskDescriptionInput"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createTaskDialogVisible = false">Отмена</el-button>
                <el-button v-if="!createTaskDialogEdit" type="primary" @click="createNewTask()">Создать задачу</el-button>
                <el-button v-if="createTaskDialogEdit" type="primary" @click="updateTask()">Сохранить задачу</el-button>
            </span>
        </el-dialog>
        <!-- dialogs -->
    </div>

</template>



<script lang="js">
import store from '../../store/index.js'
import axios from 'axios'

export default  {
    name: 'tasks',

    props: [],

    mounted() {
        this.getTasksList()
    },

    data() {
        return {
            tasksCardLoading: false,

            createTaskDialogVisible: false,
            createTasktDialogTitle: 'Создать задачу',
            createTaskDialogEdit: false,

            taskIdInput: null,
            taskNameInput: '',
            taskColorInput: '#0f90ca',
            taskDescriptionInput: '',
            predefineColors: [
                '#EA2027',
                '#EE5A24',
                '#A3CB38',
                '#1289A7',
                '#006266',
                '#ED4C67',
                '#9980FA',
            ],

            // Timer
            runningTask: null,
            currentTaskTime: 0,
            startTime: null,
            stopTime: null,
            timer: null,
            tasksTimeLog: [],

            // Search
            searchInput: '',
            searchBy: '',
        }
    },

    methods: {
        getTasksList() {
            axios.get('http://tasker-api/public/api/tasks/user/'+store.state.userId+'/project/1')
                .then(function (response) {
                    store.dispatch('setTaskList', response.data)
                })
                .catch(function (error) {
                    if ( !error.status ) {
                        this.$notify({title: 'Ошибка соединения', message: 'Проверьте соединение с сервером.', duration: 0, type: 'error'})
                    }
                    console.log(error);
                }.bind(this));
        },

        createNewTask() {
            if ( this.taskNameInput === '' ) { this.createTaskDialogVisible = false; return }

            axios.put('http://tasker-api/public/api/tasks/create', {
                user_id: store.state.userId,
                name: this.taskNameInput,
                color: this.taskColorInput,
            })
            .then(function(response) {
                let data = JSON.parse(response.data)
                if (data.status === true) {
                    this.getTaskList()
                }
            }.bind(this))
            .catch(function(error) {
                console.log(error)
            });

            this.taskNameInput = ''
            this.taskColorInput = '#0f90ca'
            this.createTaskDialogVisible = false
        },

        editTask(taskId) {
            this.createTaskDialogTitle = 'Редактировать задачу #' + taskId
            this.createTaskDialogEdit = true

            axios.get('http://tasker-api/public/api/tasks/task/' + taskId)
                .then(function(response) {
                    if ( response.data.length === 1 ) {
                        let data = response.data[0]
                        this.taskIdInput = data.id
                        this.taskNameInput = data.name
                        this.taskColorInput = data.color
                        this.createTaskDialogVisible = true
                    }
                }.bind(this))
                .catch(function(error) {
                    if ( !error.status ) {
                        this.$notify({title: 'Ошибка', message: 'Возникла ошибка при открытии задачи #' + taskId + '. Проверьте соединение с сервером.', duration: 5000, type: 'error'})
                    }
                    console.log(error);
                }.bind(this));
        },

        updateTask() {
            axios.post('http://tasker-api/public/api/tasks/update/' + this.taskIdInput, {
                    name: this.taskNameInput,
                    color: this.taskColorInput,
                    user_id: store.state.userId,
                }).then(function(response) {
                    let data = JSON.parse(response.data)
                    if (data.status === true) {
                        this.getTaskList()
                    }
                }.bind(this))
                .catch(function(error) {
                    console.log(error);
                });

                this.taskNameInput = ''
                this.taskColorInput = '#0f90ca'
                this.createTaskDialogVisible = false
        },

        deleteTask(taskId) {

            this.$confirm('Удалить задачу #' + taskId + ' ?', 'Предупреждение', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Отмена',
                type: 'warning'
            }).then(() => {
                this.tasksCardLoading = true
                axios.delete('http://tasker-api/public/api/tasks/delete/' + taskId)
                    .then(function (response) {
                        let resp = JSON.parse(response.data)
                        if ( resp === true ) {
                            this.getTaskList()
                            this.tasksCardLoading = false
                            this.$notify({title: 'Проект удален', message: 'Проект #'+ taskId +' успешно удален', duration: 5000, type: 'success'})
                        }
                        else {
                            this.tasksCardLoading = false
                            this.$notify({title: 'Ошибка', message: 'Возникла ошибка при удалении задачи #' + taskId, duration: 5000, type: 'error'})
                        }
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error)
                    })
            }).catch(() => {

            })
        },

        runTimer(taskId) {
            // Run
            if ( this.runningTask == null ) {
                this.runningTask = taskId
                this.currentTaskTime = 0
                clearInterval(this.timer)

                this.startTime = Date.now()

                this.timer = setInterval(function() {
                    this.days = Math.floor( (this.currentTaskTime/60/60) / 24);
                    this.hours = Math.floor(this.currentTaskTime/60/60);
                    this.minutes = Math.floor((this.currentTaskTime - this.hours * 60 * 60) / 60);
                    this.seconds = Math.floor(this.currentTaskTime - this.hours * 60 * 60 - this.minutes * 60);
                    this.currentTaskTime++
                }.bind(this), 1000)
            }
            // Stop
            else if ( this.runningTask === taskId ) {
                this.runningTask = null
                this.currentTaskTime = 0
                clearInterval(this.timer)

                this.stopTime = Date.now()
                this.tasksTimeLog.push({taskId: taskId, startTime: this.startTime, stopTime: this.stopTime, time: this.getTime(this.startTime, this.stopTime)})
            }
            // Switch
            else if ( this.runningTask != null && this.runningTask != taskId ) {
                this.stopTime = Date.now()
                this.tasksTimeLog.push({taskId: this.runningTask, startTime: this.startTime, stopTime: this.stopTime, time: this.getTime(this.startTime, this.stopTime)})
                this.startTime = Date.now()

                this.runningTask = taskId
                this.currentTaskTime = 0
                clearInterval(this.timer)

                this.timer = setInterval(function() {
                    this.days = Math.floor( (this.currentTaskTime/60/60) / 24);
                    this.hours = Math.floor(this.currentTaskTime/60/60);
                    this.minutes = Math.floor((this.currentTaskTime - this.hours * 60 * 60) / 60);
                    this.seconds = Math.floor(this.currentTaskTime - this.hours * 60 * 60 - this.minutes * 60);
                    this.currentTaskTime++
                }.bind(this), 1000)
            }
        },

        getTime( start, stop ) {
            let diff = Math.round((stop - start) / 1000)
            let days = Math.floor( (diff/60/60) / 24);
            let hours = Math.floor(diff/60/60);
            let minutes = Math.floor((diff - hours * 60 * 60) / 60);
            let seconds = Math.floor(diff - hours * 60 * 60 - minutes * 60);

            let str = ''
            if ( hours > 0  ) { str += hours +'h ' }
            if ( minutes > 0  ) { str += minutes +'m ' }
            if ( seconds > 0  ) { str += seconds +'s ' }
            return str
        },
    },

    computed: {
        taskList() {
            if ( this.searchInput === '' && this.searchBy === '' ) {
                return store.state.tasks;
            }
            else if ( this.searchInput.length > 0 ) {
                let tasks = store.state.tasks
                let list = tasks.filter(function(tasks) {
                    if ( tasks.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0 ) {
                        return true
                    }
                }.bind(this))
                return list
            }
        },
    }
}
</script>



<style scoped lang="scss">

.tasks {
    font: 400 16px 'Roboto', sans-serif;

    .tasks-card {
        .tasks-card-header {
            display: flex;

            .title {
                margin-right: auto;
            }
        }

        .tasks-card-body {
            .el-input {
                margin: 0 0 20px 0;

                .el-select {
                    width: 110px;
                }
            }

            .input-with-select .el-input-group__prepend {
                background: #fff;
            }

            .task-item {
                display: flex;
                align-items: center;
                margin-bottom: 2px;
                padding: 0px 15px;
                min-height: 60px;
                background: #f5f5f5;

                &:hover {
                    background: #fff;

                    .color {
                        transform: translateX(-15px);
                        height: 60px;
                        width: 3px;
                    }
                }

                .color {
                    display: inline-block;
                    margin-right: 15px;
                    width: 20px;
                    height: 20px;
                    border-radius: 3px;
                    vertical-align: middle;
                    transition: all 0.3s;
                }

                .name {
                    display: inline-block;
                    margin: 0 auto 0 0;
                    font: 400 14px/21px 'Roboto', sans-serif;
                    vertical-align: middle;
                }

                .button-group {
                    display: flex;

                    .button {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 40px;
                        min-width: 40px;
                        background: #fff;
                        border: 1px solid #dcdfe6;
                        border-right: none;
                        cursor: pointer;
                        transition: border 0.2s;

                        &:first-child {
                            border-radius: 4px 0 0 4px;
                        }

                        &:last-child {
                            border-right: 1px solid #dcdfe6;
                            border-radius: 0 4px 4px 0;
                        }

                        & > svg {
                            width: 24px;
                            height: 24px;
                            fill: #e2e2e2;
                            transition: fill 0.2s;
                        }

                        &:hover {
                            & > svg {
                                fill: #0f90ca;
                            }
                        }
                    }
                }
            }
        }
    }

    .input {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        span {
            margin-left: 15px;
        }
    }
}

.el-select-dropdown__item {
    font: 400 14px 'Roboto', sans-serif;
}

</style>
