<template>
    <div class="error-div row">
        <i class="error-div__danger-sign fas fa-exclamation-triangle offset-1 col-2"></i>
        <p class="error-div__msg col-8">{{msg}}</p>
        <div class="error-div__footer">
            <button class="error-div__btn offset-9 col-2" @click="switchComponent('Home')">Quitter</button>
        </div>
    </div>
</template>

<script>
import { bus } from '../main'

export default {
    methods: {
        switchComponent(componentName) {
            if (this.notIndex) {
                this.$router.push({name: 'index'});
            } else {
                bus.$emit('switchComponent', componentName);
            }
        }
    },

    props: {
        msg: {
            type: String,
            required: true
        },

        notIndex: false
    }
}

</script>

<style lang="scss" scoped>
    .error-div {
        max-width: 550px;
        margin: 100px auto;
        box-shadow: 0 0 5px #a4a4a4;
    }

    .error-div__footer {
        border-top: solid 1px #BFBFBF;
        width: 100%;
        background-color: #F8F8F8;
    }

    .fa-exclamation-triangle {
        color: #F26D21;
        font-size: 50px;
        margin-top: 30px;
        margin-bottom: 40px;
    }

    .error-div__msg {
        margin-top: 30px;
        margin-bottom: 40px;
        font-weight: 800;
    }

    .error-div__btn {
        font-size: 13px;
        outline: none;
        border-radius: 8px;
        padding: 5px 10px;
        background-color: #0E72ED;
        font-weight: 700;
        color: white;
        border: solid transparent 1px;
        margin-top: 20px;
        margin-bottom: 20px;
        &:hover {
            background-color: #0c58b4;
        }
        &:active {
            background-color: #0a4083;
        }
    }
</style>