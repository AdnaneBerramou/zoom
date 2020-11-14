<template>
    <div class="join-div row">
        <h4 class="join-div__heading col-11 offset-1">Rejoindre une réunion</h4>
        <div class="w-100"></div>
        <input class="join-div__input col-10 offset-1" type="text" v-model="roomId" ref="roomIdField" placeholder="Saisir l'ID de réunion">
        <input class="join-div__input col-10 offset-1" type="text" v-model="userPseudo" ref="userPseudoField" placeholder="Saisir votre nom/pseudo">
        <button class="join-div__btn join-div__btn--blue col-3 offset-4" @click="joinRoom()">Rejoindre</button>
        <button class="join-div__btn join-div__btn--white col-3 offset-1"  @click="switchComponent('Home')">Annuler</button>
        <p class="join-div__err-msg col-12" v-if='roomIdFieldErr'>L'ID de reunion est invalide, un ID type contient 11 chiffres, rien de moins, rien de plus.</p>
        <p class="join-div__err-msg col-12" v-if='userPseudoFieldErr'>Votre nom/pseudo est invalide, en effet il doit contenir au mois 1 caractères et au maximum 50, que ca soit des lettres, chiffres ou caractères spéciaux.</p>
    </div>
</template>

<script>
import { bus } from '../main'

export default {
    data() {
        return {
            roomId: '',
            userPseudo: '',
            roomIdFieldErr: false,
            userPseudoFieldErr: false,
        };
    },

    computed: {
        validRoomId(){
            let roomId = this.roomId.replace(/\s+/g, '');
            return roomId.match(/^[0-9]{11}$/) ? roomId : false;
        },

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
            this.$refs[field].classList.add('join-div__input--error');
            this.$refs[field].classList.remove('join-div__input--success');
            this[field+'Err'] = true;
        },

        fieldSuccess(field) {
            this.$refs[field].classList.add('join-div__input--success');
            this.$refs[field].classList.remove('join-div__input--error');
            this[field+'Err'] = false;
        },

        checkFields() {
            if (this.validUserPseudo === false || this.validRoomId === false) {
                if (this.validUserPseudo === false) {
                    this.fieldError('userPseudoField');
                } else {
                    this.fieldSuccess('userPseudoField');
                }
                if (this.validRoomId === false) {
                    this.fieldError('roomIdField');
                } else {
                    this.fieldSuccess('roomIdField');
                }
                return false;
            } else {
                this.fieldSuccess('userPseudoField');
                this.fieldSuccess('roomIdField');
                return true;
            }
        },

        joinRoom() {
            if (this.checkFields()) {
                this.$http.get('http://localhost:3000/find-room', {params: {id: this.validRoomId}}).then(result => {
                    if (result.data.err === undefined) {
                        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
                            stream.getTracks().forEach(track => {
                                track.stop();
                            });
                            localStorage.setItem('zoom-pseudo', this.validUserPseudo);
                            this.$router.push({name: 'room', params: {id: this.validRoomId}});
                        }).catch(error => {
                            bus.$emit('error', 'Pour vous laisser participer à une réunion, nous avons besoin d\'accéder à votre webcam ainsi que votre microphone. Une fois en réunion, vous pourrez les activer/désactiver à votre guise. Si le navigateur ne vous propose plus de nous autoriser les accès (suite à un premier refus de votre part) il faudra que vous alliez bidouiller les paramètres de votre navigateur. Une fois les permissions données, vous n\'aurez aucun message d\'erreur');
                        });
                    } else {
                        bus.$emit('error', 'Cette réunion n\'existe pas/plus. Vérifiez et réessayez.');
                    }
                }).catch(error => {
                    //infromez d'une erreur de serveur, et demander de revenir plus tard (compo sepcial err 500?)
                    bus.$emit('error', 'Une erreur interne est survenue. Veuillez réessayer plus tard.');
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .join-div {
        max-width: 550px;
        margin: 100px auto;
        box-shadow: 0 0 5px #a4a4a4;
        padding: 70px 50px;
    }

    .join-div__heading {
        font-weight: 800;
        margin-bottom: 20px;
    }

    .join-div__input {
        margin-top: 15px;
        border-radius: 10px;
        border: #BABACC 2px solid;
        outline: none;
        padding: 5px;
        &:focus {
            border-color: #0E72ED;
        }
    }

    .join-div__input--error {
        border-color: #d9534f;
    }

    .join-div__input--success {
        border-color: #5cb85c;
    }

    .join-div__btn {
        margin-top: 20px;
        font-size: 13px;
        outline: none;
        border-radius: 8px;
        margin-bottom: 20px;
        padding: 5px 10px;
    }

    .join-div__btn--white {
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

    .join-div__btn--blue {
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

    .join-div__err-msg {
        text-align: center;
        color: #d9534f;
        font-weight: 700;
        font-size: 13px;
    }

</style>