<template lang="html">

    <div v-if="isActive" class="countdown-timer">
        <div class="hours">{{ hours }}</div>
        <div class="double-dots"> : </div>
        <div class="minutes">{{ minutes }}</div>
        <div class="double-dots"> : </div>
        <div class="seconds">{{ seconds }}</div>
    </div>

</template>



<script lang="js">

export default  {
    name: 'countdownTimer',

    props: ['timestamp'],

    mounted() {
        this.start()
    },

    data() {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        }
    },

    methods: {

        start() {
            let timer = setInterval(function() {

                if ( this.timestamp > 0 ) {
                    this.timestamp--
                    this.days = Math.floor( (this.timestamp/60/60) / 24);
                    this.hours = Math.floor(this.timestamp/60/60);
                    this.minutes = Math.floor((this.timestamp - this.hours * 60 * 60) / 60);
                    this.seconds = Math.floor(this.timestamp - this.hours * 60 * 60 - this.minutes * 60);
                }

            }.bind(this), 1000);

            if ( this.timestamp === 0 ) {
                clearInterval(timer);
            }
        },

    },

    computed: {
        isActive() {
            if ( this.timestamp > 0 ) {
                return true
            }
            else {
                return false
            }
        }
    }
}

</script>



<style scoped lang="scss">

.countdown-timer {
    display: flex;
    align-items: center;
    padding: 0 0 0 5px;
    max-width: 100px;
    height: 100%;
    font: 300 26px/21px 'Roboto', sans-serif;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.9);
    }
    25% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

</style>
