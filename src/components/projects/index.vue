<template lang="html">

    <div class="projects">
        <el-row :gutter="20">

            <el-col :span="12">
                <el-card class="projects-card">
                    <div slot="header" class="clearfix projects-card-header">
                        <span class="title">Проекты</span>
                        <el-button style="padding: 0" type="text" @click="createProjectDialogVisible = true">Создать проект</el-button>
                    </div>
                    <div class="projects-card-body" v-loading="projectsCardLoading">
                        <el-input placeholder="Поиск" v-model="searchInput" class="input-with-select" clearable>
                            <el-select v-model="searchBy" slot="prepend" placeholder="Везде">
                                <el-option label="По ID" value="id"></el-option>
                                <el-option label="По имени" value="name"></el-option>
                                <el-option label="По тегам" value="tags"></el-option>
                            </el-select>
                        </el-input>
                        <div class="project-item" v-for="project in projectList">
                            <span class="color" v-bind:style="{ background: project.color }"></span>
                            <span class="name">{{ project.name }}</span>
                            <div class="button-group">
                                <router-link :to="{ name: 'tasksOfProject', params: { project_id: project.id }}" class="button">
                                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                    </svg>
                                </router-link>
                                <div class="button" @click="editProject(project.id)">
                                    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                    </svg>
                                </div>
                                <div class="button" @click="deleteProject(project.id)">
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
                <el-card class="projects-card">
                    <div slot="header" class="clearfix projects-card-header">
                        <span>Активность</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- dialogs -->
        <el-dialog :title="createProjectDialogTitle" :visible.sync="createProjectDialogVisible" width="30%">
            <el-input class="input" placeholder="Название проекта" v-model="projectNameInput" v-on:keyup.enter="createNewProject()" clearable autofocus></el-input>
            <div class="input">
                <el-color-picker v-model="projectColorInput" :predefine="predefineColors"></el-color-picker>
                <span>Выбор цвета</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createProjectDialogVisible = false">Отмена</el-button>
                <el-button v-if="!createProjectDialogEdit" type="primary" @click="createNewProject()">Создать проект</el-button>
                <el-button v-if="createProjectDialogEdit" type="primary" @click="updateProject()">Сохранить проект</el-button>
            </span>
        </el-dialog>
        <!-- dialogs -->
        
    </div>

</template>



<script lang="js">
import store from '../../store/index.js'
import axios from 'axios'

export default  {
    name: 'projects',

    props: [],

    mounted() {
        this.getProjectList()
    },

    data() {
        return {
            projectsCardLoading: false,

            createProjectDialogVisible: false,
            createProjectDialogTitle: 'Создать проект',
            createProjectDialogEdit: false,

            projectIdInput: null,
            projectNameInput: '',
            projectColorInput: '#0f90ca',
            predefineColors: [
                '#EA2027',
                '#EE5A24',
                '#A3CB38',
                '#1289A7',
                '#006266',
                '#ED4C67',
                '#9980FA',
            ],

            searchInput: '',
            searchBy: '',
        }
    },

    methods: {
        getProjectList() {
            axios.get('http://tasker-api/public/api/projects/user_id/1')
                .then(function (response) {
                    store.dispatch('setProjectList', response.data)
                })
                .catch(function (error) {
                    if ( !error.status ) {
                        this.$notify({title: 'Ошибка соединения', message: 'Проверьте соединение с сервером.', duration: 0, type: 'error'})
                    }
                    console.log(error);
                }.bind(this));
        },

        createNewProject() {
            if ( this.projectNameInput === '' ) { this.createProjectDialogVisible = false; return }

            axios.put('http://tasker-api/public/api/projects/create', {
                user_id: store.state.userId,
                name: this.projectNameInput,
                color: this.projectColorInput,
            })
            .then(function(response) {
                let data = JSON.parse(response.data)
                if (data.status === true) {
                    this.getProjectList()
                }
            }.bind(this))
            .catch(function(error) {
                console.log(error)
            });

            this.projectNameInput = ''
            this.projectColorInput = '#0f90ca'
            this.createProjectDialogVisible = false
        },

        editProject(projectId) {
            this.createProjectDialogTitle = 'Редактировать проект #' + projectId
            this.createProjectDialogEdit = true

            axios.get('http://tasker-api/public/api/projects/project_id/' + projectId)
                .then(function(response) {
                    if ( response.data.length === 1 ) {
                        let data = response.data[0]
                        this.projectIdInput = data.id
                        this.projectNameInput = data.name
                        this.projectColorInput = data.color
                        this.createProjectDialogVisible = true
                    }
                }.bind(this))
                .catch(function(error) {
                    if ( !error.status ) {
                        this.$notify({title: 'Ошибка', message: 'Возникла ошибка при открытии проекта #' + projectId + '. Проверьте соединение с сервером.', duration: 5000, type: 'error'})
                    }
                    console.log(error);
                }.bind(this));
        },

        updateProject() {
            axios.post('http://tasker-api/public/api/projects/update/' + this.projectIdInput, {
                    name: this.projectNameInput,
                    color: this.projectColorInput,
                    user_id: store.state.userId,
                }).then(function(response) {
                    let data = JSON.parse(response.data)
                    if (data.status === true) {
                        this.getProjectList()
                    }
                }.bind(this))
                .catch(function(error) {
                    console.log(error);
                });

                this.projectNameInput = ''
                this.projectColorInput = '#0f90ca'
                this.createProjectDialogVisible = false
        },

        deleteProject(projectId) {

            this.$confirm('Удалить проект #' + projectId + ' ?', 'Предупреждение', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Отмена',
                type: 'warning'
            }).then(() => {
                this.projectsCardLoading = true
                axios.delete('http://tasker-api/public/api/projects/delete/' + projectId)
                    .then(function (response) {
                        let resp = JSON.parse(response.data)
                        if ( resp === true ) {
                            this.getProjectList()
                            this.projectsCardLoading = false
                            this.$notify({title: 'Проект удален', message: 'Проект #'+ projectId +' успешно удален', duration: 5000, type: 'success'})
                        }
                        else {
                            this.projectsCardLoading = false
                            this.$notify({title: 'Ошибка', message: 'Возникла ошибка при удалении проекта #' + projectId, duration: 5000, type: 'error'})
                        }
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error)
                    })
            }).catch(() => {

            })
        },

        newProjectId() {
            var maxProjectId = 0
            if ( this.projectList.length > 0 ) {
                this.projectList.forEach(function(item, i, arr) {
                    if ( maxProjectId < item.projectId ) {
                        maxProjectId = item.projectId
                    }
                    if ( ( arr.length - 1) === i ) {
                        return true
                    }
                })
                return maxProjectId + 1
            }
            else {
                return maxProjectId + 1
            }
        },

        formatDate(timestamp) {
            let dateObj = new Date(timestamp)
            let year = dateObj.getFullYear()
            let month = dateObj.getMonth()
            let day = dateObj.getDate()
            let date = year + ' ' + month + ' ' + day
            return date
        }
    },

    computed: {
        projectList() {
            if ( this.searchInput === '' && this.searchBy === '' ) {
                return store.state.projects;
            }
            else if ( this.searchInput.length > 0 ) {
                let projects = store.state.projects
                let list = projects.filter(function(projects) {
                    if ( projects.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0 ) {
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

.projects {
    font: 400 16px 'Roboto', sans-serif;

    .projects-card {
        .projects-card-header {
            display: flex;

            .title {
                margin-right: auto;
            }
        }

        .projects-card-body {
            .el-input {
                margin: 0 0 20px 0;

                .el-select {
                    width: 110px;
                }
            }

            .input-with-select .el-input-group__prepend {
                background: #fff;
            }
            .project-item {
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
