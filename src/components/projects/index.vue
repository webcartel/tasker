<template lang="html">

    <div class="projects">
        <el-row>

            <el-col :span="12">
              <el-card class="projects-card">
                  <div slot="header" class="clearfix projects-card-header">
                      <span>Проекты</span>
                      <el-button style="float: right; padding: 3px 0" type="text" @click="createProjectDialogVisible = true">Создать проект</el-button>
                  </div>

                  <div class="project-item" v-for="project in projectList">
                      <span class="color" v-bind:style="{ background: project.projectColor }"></span>
                      <span class="name">{{ project.projectName }}</span>
                  </div>
              </el-card>
            </el-col>

            <el-col :span="12">
              
            </el-col>
        </el-row>

        <!-- dialogs -->
        <el-dialog
            title="Создать проект"
            :visible.sync="createProjectDialogVisible"
            width="30%">
            <el-input placeholder="Название проекта" v-model="projectNameInput" v-on:keyup.enter="createNewProject()" clearable autofocus></el-input>
            <el-color-picker
              v-model="projectColorInput"
              :predefine="predefineColors">
            </el-color-picker>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createProjectDialogVisible = false">Отмена</el-button>
                <el-button type="primary" @click="createNewProject()">Создать проект</el-button>
            </span>
        </el-dialog>
        <!-- dialogs -->
    </div>

</template>



<script lang="js">

export default  {
    name: 'projects',

    props: [],

    mounted() {
        this.setLocalStorage()
        this.getProjectList()
    },

    data() {
        return {
            storage: {},
            createProjectDialogVisible: false,
            projectNameInput: '',
            projectColorInput: '#eee',
            predefineColors: [
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
            ],
            projectList: {},
        }
    },

    methods: {
        createNewProject() {
            if ( this.projectNameInput === '' ) { this.createProjectDialogVisible = false; return }

            let newId = this.newProjectId()
            let createTimestamp = new Date().getTime();
            this.storage.projects.push( {projectId: newId, projectName: this.projectNameInput, projectColor: this.projectColorInput, createTimestamp: createTimestamp} )
            localStorage.setItem('storage', JSON.stringify(this.storage))
            this.getProjectList()
            this.projectNameInput = ''
            this.projectColorInput = '#fff'
            this.createProjectDialogVisible = false
        },

        newProjectId() {
            this.getProjectList()
            if ( this.projectList.length === undefined ) {
                return 1
            }
            else {
                return this.projectList.length + 1
            }
        },

        getProjectList() {
            this.projectList = this.getStorageLikeObject().projects
        },

        getStorageLikeObject() {
            if ( localStorage.getItem('storage') ) {
                return JSON.parse(localStorage.getItem('storage'))
            }
        },

        setLocalStorage() {
            let storage = {
                projects: []
            }
            if ( !localStorage.getItem('storage') ) {
                localStorage.setItem('storage', JSON.stringify(storage))
                this.storage = storage
            }
            else {
                this.storage = JSON.parse(localStorage.getItem('storage'))
            }
        }
    },

    computed: {

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
            padding: 15px 15px;
            margin-bottom: 10px;
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
                font: 400 14px/21px 'Roboto', sans-serif;
                vertical-align: middle;
            }
        }
    }
}

</style>
