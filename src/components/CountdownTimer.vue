<template lang="html">

    <div class="countdown-timer">
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

    props: [],

    mounted() {
        this.start()
    },

    data() {
        return {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
            timestamp: 60,
        }
    },

    methods: {

        start() {
            setInterval(function() {

                if ( this.timestamp >= 0 ) {
                    this.days = Math.floor( (this.timestamp/60/60) / 24);
                    this.hours = Math.floor(this.timestamp/60/60);
                    this.minutes = Math.floor((this.timestamp - this.hours * 60 * 60) / 60);
                    this.seconds = Math.floor(this.timestamp - this.hours * 60 * 60 - this.minutes * 60);
                    this.timestamp--
                }

            }.bind(this), 1000);
        },

    },

    computed: {

    }
}

</script>



<style scoped lang="scss">

.countdown-timer {
    display: flex;
}

</style>
