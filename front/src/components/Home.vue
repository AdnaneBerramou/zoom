<template>
    <div class="home-div row">
        <div class="home-div__logo col-12"><img src="../assets/zoomLogo.png" alt="logo zoom"></div>
        <div class="w-100"></div>
        <button class="home-div__btn home-div__btn--blue col-6 offset-3" @click="switchComponent('Join')">Rejoindre une réunion</button>
        <div class="w-100"></div>
        <button class="home-div__btn home-div__btn--white col-6 offset-3" @click="switchComponent('Create')">Créer une réunion</button>
        <p class="home-div__infos col-12">Version : 1.0 by adzer</p>
    </div>
</template>

<script>
import { bus } from '../main'

export default {
    methods: {
        switchComponent(componentName) {
            bus.$emit('switchComponent', componentName);
        }
    }
}
</script>

<style lang="scss" scoped>
    .home-div {
        max-width: 550px;
        margin: 100px auto;
    }

    .home-div__logo {
        text-align: center;
        margin-top: 50px;
        margin-bottom: 50px;
    }

    .home-div__btn {
        font-size: 14px;
        border-radius: 8px;
        outline: none;
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .home-div__btn--blue {
        background-color: #0E72ED;
        font-weight: 700;
        color: white;
        border: solid transparent 1px;
        &:hover {
            background-color: #0c58b4;
        }
        &:active {
            background-color: #0a4083;
        }
    }

    .home-div__btn--white {
        border: solid #e7e7e7 1px;
        background-color: white;
        &:hover {
            background-color: #e7e7e7;
        }
        &:active {
            background-color: #1162c5;
            color: white;
        }
    }

    .home-div__infos {
        font-size: 12px;
        color: #acacac;
        text-align: center;
        margin-top: 80px;
    }
</style>