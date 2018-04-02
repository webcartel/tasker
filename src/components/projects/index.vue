<template lang="html">

    <div class="projects">
        <el-button size="medium" @click="createProjectDialogVisible = true">Создать проект</el-button>

        <div v-for="project in projectList">{{ project.projectName }}</div>

        <!-- dialogs -->
        <el-dialog
            title="Создать проект"
            :visible.sync="createProjectDialogVisible"
            width="30%">
            <el-input placeholder="Название проекта" v-model="projectNameInput"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createProjectDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="createNewProject()">Создать проект</el-button>
            </span>
        </el-dialog>
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
            storage: {
                projects: []
            },
            createProjectDialogVisible: false,
            projectNameInput: '',
            projectList: {},
        }
    },

    methods: {
        createNewProject() {
            let newId = this.newProjectId()
            this.storage.projects.push({projectId: newId, projectName: this.projectNameInput})
            localStorage.setItem('storage', JSON.stringify(this.storage))
            this.projectNameInput = ''
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
            else {
                return {projects:[]}
            }
        },

        setLocalStorage() {
            if ( !localStorage.getItem('storage') ) {
                localStorage.setItem('storage', JSON.stringify(this.storage))
            }
        }
    },

    computed: {

    }
}

</script>



<style scoped lang="scss">

.projects {
    
}

</style>
