<template>
    <div class="create-div row">
        <h4 class="create-div__heading col-11 offset-1">Créer une réunion</h4>
        <div class="w-100"></div>
        <input class="create-div__input col-10 offset-1" type="text" v-model="userPseudo" ref="userPseudoField" placeholder="Saisir votre nom/pseudo">
        <button class="create-div__btn create-div__btn--blue col-3 offset-4" @click="createRoom()">Créer</button>
        <button class="create-div__btn create-div__btn--white col-3 offset-1"  @click="switchComponent('Home')">Annuler</button>
        <p class="create-div__err-msg col-12" v-if='userPseudoFieldErr'>Votre nom/pseudo est invalide, en effet il doit contenir au mois 1 caractères et au maximum 50, que ca soit des lettres, chiffres ou caractères spéciaux.</p>
    </div>
</template>

<script>
import { bus } from '../main'

export default {
    data() {
        return {
            userPseudo: '',
            userPseudoFieldErr: false
        };
    },

    computed: {
        validUserPseudo(){
            let userPseudo = this.userPseudo.trim().replace(/\s+/g, ' ');
            return userPseudo.match(/^.{1,50}$/) ? userPseudo : false;
        },
    },

    methods: {
        switchComponent(componentName) {
            bus.$emit('switchComponent', componentName);
        },

        fieldError(field) {
            this.$refs[field].classList.add('create-div__input--error');
            this.$refs[field].classList.remove('create-div__input--success');
            this[field+'Err'] = true;
        },

        fieldSuccess(field) {
            this.$refs[field].classList.add('create-div__input--success');
            this.$refs[field].classList.remove('create-div__input--error');
            this[field+'Err'] = false;
        },

        checkFields() {
            if (this.validUserPseudo === false) {
                this.fieldError('userPseudoField');
            } else {
                this.fieldSuccess('userPseudoField');
                return true;
            }
        },

        createRoom() {
            if (this.checkFields()) {
                navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
                    stream.getTracks().forEach(track => {
                        track.stop();
                    });
                    localStorage.setItem('zoom-pseudo', this.validUserPseudo);
                    this.$http.get('http://localhost:3000/create-room').then(result => {
                        this.$router.push({name: 'room', params: {id: result.data.id}});
                    }).catch(error => {
                        bus.$emit('error', 'Une erreur interne est survenue. Veuillez réessayer plus tard.');
                    });
                }).catch(error => {
                    bus.$emit('error', 'Pour vous laisser participer à une réunion, nous avons besoin d\'accéder à votre webcam ainsi que votre microphone. Une fois en réunion, vous pourrez les activer/désactiver à votre guise. Si le navigateur ne vous propose plus de nous autoriser les accès (suite à un premier refus de votre part) il faudra que vous alliez bidouiller les paramètres de votre navigateur. Une fois les permissions données, vous n\'aurez aucun message d\'erreur');
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .create-div {
        box-shadow: 0 0 5px #a4a4a4;
        margin: 100px auto;
        max-width: 550px;
        padding: 70px 50px;
    }

    .create-div__heading {
        font-weight: 800;
        margin-bottom: 20px;
    }

    .create-div__input {
        margin-top: 15px;
        border-radius: 10px;
        border: #BABACC 2px solid;
        outline: none;
        padding: 5px;
        &:focus {
            border-color: #0E72ED;
        }
    }

    .create-div__input--error {
        border-color: #d9534f;
    }

    .create-div__input--success {
        border-color: #5cb85c;
    }

    .create-div__btn {
        margin-top: 20px;
        font-size: 13px;
        outline: none;
        border-radius: 8px;
        margin-bottom: 20px;
        padding: 5px 10px;
    }

    .create-div__btn--white {
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

    .create-div__btn--blue {
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

    .create-div__err-msg {
        text-align: center;
        color: #d9534f;
        font-weight: 700;
        font-size: 13px;
    }
</style>