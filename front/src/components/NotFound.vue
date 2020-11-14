<template>
    <div class="notfound">
        <h1 class="notfound__heading">Erreur 404, page non trouvée.</h1>
        <button class="notfound__btn" @click="$router.push({name: 'index'})">Retour Accueil</button>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
    .notfound {
        display: flex;
        flex-direction: column;
    }

    .notfound__heading {
        text-align: center;
        margin-top: 200px;
    }

    .notfound__btn {
        margin: 20px auto;
        border-radius: 10px;
        padding: 5px 20px;
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