<template>
    <div id="form-div" class="row">
        <h4 class="col-11 offset-1">Rejoindre une réunion</h4>
        <div class="w-100"></div>
        <input class="col-10 offset-1" type="text" ref="room-id" id="room-id" placeholder="Saisir l'ID de réunion">
        <input class="col-10 offset-1" type="text" ref="user" id="user" placeholder="Saisir votre nom">
        <button class="col-3 offset-4" id="submit">Rejoindre</button>
        <button @click='home()' class="col-3 offset-1" id="cancel">Annuler</button>
    </div>
</template>

<script>
export default {
    methods: {
        home() {
            window.location.href = window.location.href.split`/`.filter((v, k, s) => k < 3).join`/`;
        }
    }
}

</script>

<style lang="scss" scoped>
    #form-div {
        max-width: 550px;
        margin: 100px auto;
        box-shadow: 0 0 5px #a4a4a4;
        padding: 70px 50px;
    }

    h4 {
        font-weight: 800;
        margin-bottom: 20px;
    }

    input {
        margin-top: 15px;
        border-radius: 10px;
        border: #BABACC 2px solid;
        outline: none;
        padding: 5px;
        &:focus {
            border-color: #0E72ED;
        }
    }

    button {
        margin-top: 20px;
        font-size: 13px;
        outline: none;
        border-radius: 8px;
        padding: 5px 10px;
    }

    #cancel {
        background-color: white;
        border: solid #e7e7e7 1px;
        &:hover {
            background-color: #e7e7e7;
        }
        &:active {
            background-color: #1162c5;
            color: white;
        }
    }

    #submit {
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

</style>