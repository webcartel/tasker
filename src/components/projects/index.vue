<template lang="html">

    <div class="projects">
        <el-row :gutter="20">

            <el-col :span="12">
                <el-card class="projects-card">
                    <div slot="header" class="clearfix projects-card-header">
                        <span>Проекты</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="createProjectDialogVisible = true">Создать проект</el-button>
                    </div>
                    <div class="projects-card-body" v-loading="projectsCardLoading">
                        <div class="project-item" v-for="project in projectList">
                            <span class="color" v-bind:style="{ background: project.color }"></span>
                            <span class="name">{{ project.name }}</span>
                            <el-button-group>
                                <el-button icon="el-icon-tickets" plain></el-button>
                                <el-button icon="el-icon-edit" plain @click="editProject(project.id)"></el-button>
                                <el-button icon="el-icon-delete" plain @click="deleteProject(project.id)"></el-button>
                            </el-button-group>
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
        }
    },

    methods: {
        getProjectList() {
            axios.get('http://tasker-api/public/api/projects/user_id/1')
                .then(function (response) {
                    store.dispatch('setProjectList', response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
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
            this.createProjectDialogVisible = true
            this.createProjectDialogTitle = 'Редактировать проект'
            this.createProjectDialogEdit = true

            axios.get('http://tasker-api/public/api/projects/project_id/' + projectId)
                .then(function(response) {
                    if ( response.data.length === 1 ) {
                        let data = response.data[0]
                        this.projectIdInput = data.id
                        this.projectNameInput = data.name
                        this.projectColorInput = data.color
                    }
                }.bind(this))
                .catch(function(error) {
                    console.log(error);
                });
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
            return store.state.projects;
        },
    }
}

</script>



<style scoped lang="scss">

.projects {
    font: 400 16px 'Roboto', sans-serif;

    .projects-card {
        .projects-card-header {

        }

        .project-item {
            display: flex;
            align-items: center;
            margin-bottom: 2px;
            padding: 0px 15px;
            min-height: 60px;
            background: #f5f5f5;

            .color {
                display: inline-block;
                margin-right: 15px;
                width: 20px;
                height: 20px;
                border-radius: 3px;
                vertical-align: middle;
            }

            .name {
                display: inline-block;
                margin: 0 auto 0 0;
                font: 400 14px/21px 'Roboto', sans-serif;
                vertical-align: middle;
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

</style>
