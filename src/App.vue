<template>
    <div id="app">
        <el-container>
            <el-aside></el-aside>
            <el-container>
                <el-header>
                    <countdown-timer/>
                </el-header>
                <el-main>
                    <router-view/>
                </el-main>
                <el-footer></el-footer>
            </el-container>
        </el-container>
    </div>
</template>



<script>
import countdownTimer from '@/components/CountdownTimer.vue';

export default {
    name: 'App',
    components: { countdownTimer },
}
</script>



<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#app {
    position: relative;
    height: auto;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

#app > .el-container {
    height: 100vh;
}

.el-header {
    background: #0f90ca;
    color: #fff;
}

.el-footer {
    background: #dde0e4;
    color: #333;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
}

.el-notification__title {
    font: 500 16px/18px 'Roboto', sans-serif;
}

.el-notification__content {
    font: 400 14px/16px 'Roboto', sans-serif;
    text-align: left;
}

.el-message-box__title {
    font: 500 16px/18px 'Roboto', sans-serif;
}

.el-message-box__content {
    font: 400 14px/16px 'Roboto', sans-serif;
    text-align: left;
}

</style>
