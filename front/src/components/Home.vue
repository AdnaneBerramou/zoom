<template>
    <div id="home-div" class="row flex-column">
        <div id="logo-div" class="col-12"><img src="../assets/zoomLogo.png" class="" alt="logo zoom"></div>
        <div class="w-100"></div>
        <button @click="link('join')" id="join-room" class="col-6 offset-3 col-lg-4 offset-lg-4">Rejoindre une réunion</button>
        <div class="w-100"></div>
        <button @click="link('room')" id="create-room" class="col-6 offset-3 col-lg-4 offset-lg-4">Créer une réunion</button>
        <p class="version col-12">Version : 1.0 by adzer</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newRoom: null
        }
    },
    methods: {
        link(route) {
            if (route == 'room') {
                this.$http.get('http://localhost:3000/create-room').then(resu => {
                    this.newRoom = resu.data.id;
                    window.location.href = window.location.href.split`/`.filter((v, k, s) => k < 3).join`/` + '/room/' + this.newRoom;
                }).catch(err => {
                    alert('svp essayer plus tard');
                });
            } else {
                window.location.href = window.location.href.split`/`.filter((v, k, s) => k < 3).join`/` + '/' + route;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    #home-div {
        padding: 50px;
        margin: 80px 80px 20px 80px;

    }

    #logo-div {
        text-align: center;
        margin-top: 50px;
        margin-bottom: 50px;
    }

    button {
        font-size: 14px;
        border-radius: 8px;
        outline: none;
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    #join-room {
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

    #create-room {
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

    .version {
        font-size: 12px;
        color: #acacac;
        text-align: center;
        margin-top: 80px;
    }
</style>