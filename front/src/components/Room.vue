<template>
    <div class="container-fluid" style="width: 100%; height: 100%; padding:0;">
        <div class="room row" v-if="roomAvailable">
            <div class="room__video-grid col-12" ref="videoGrid"></div>
            <div class="room-users-chat" ref="chatUsers">
                <div class="room__users" v-if="!hideUsers" ref="users">
                    <h5 class="users__heading">Participants ({{nbVideos}})</h5>
                    <div class="users__list">
                        <ul>
                            <li v-for="(val, index) in allUsers" :key="index">
                                <span class="decorative-square" :style="{backgroundColor: val.color}">{{val.pseudo[0].toUpperCase()}}</span>{{val.pseudo}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="room__chat" v-if="!hideChat">
                    <h5 class="chat__heading">Chat</h5>
                    <div class="chat__output" ref="chatOutput"></div>
                    <textarea class="chat__input" ref="chatInput" placeholder="Saisr le message ici..."></textarea>
                    <button class="chat__submit" @click="sendMsg()">envoyer</button>
                </div>
            </div>
            <div class="room__footer col-12 row d-flex align-items-center justify-content-center" ref="roomFooter">
                <div class="footer__controls col-3 d-flex justify-content-start">
                    <div class="controls__icon controls__icon--right" @click="muteUnmuteAudio()"><i class="fas fa-microphone" ref="microphone"></i><br><span>Micro</span></div>
                    <div class="controls__icon controls__icon--left" @click="stopPlayVideo()"><i class="fas fa-video" ref="video"></i><br><span>Caméra</span></div>
                </div>

                <div class="footer__controls col-6 d-flex justify-content-center">
                    <div class="controls__icon controls__icon--right" @click="test()"><i class="fas fa-shield-alt"></i><br><span>Sécurité</span></div>
                    <div class="controls__icon" @click="hideDisplay('hideUsers')"><i class="fas fa-user-friends"></i><sup>{{nbVideos}}</sup><br><span>Participants</span></div>
                    <div class="controls__icon controls__icon--left" @click="hideDisplay('hideChat')"><i class="fas fa-comment-alt"></i><br><span>Chat</span></div>
                </div>

                <button class="footer__btn col-2 offset-1 col-lg-1 offset-lg-2" @click="home()">Fin</button>
            </div>
        </div>
        <error-component v-if="!roomAvailable&&roomAvailable!==undefined" :msg="errorMsg" :notIndex='true'></error-component>
    </div>
</template>

<script scoped>
import ErrorComponent from './Error';

export default {
    data() {
        return {
            roomAvailable: undefined,
            errorMsg: '',
            userPseudo: '',
            userStream: false,
            socket: false,
            peer: false,
            nbVideos: 0,
            hideChat: true,
            hideUsers: true,
            allUsers: []
        };
    },

    computed: {
        nbColumns() {
            return 'auto '.repeat(Math.ceil(Math.sqrt(this.nbVideos)));
        }
    },

    methods: {
        home() {
            this.$router.push({name: 'index'});
        },

        sendMsg() {
            if (this.$refs.chatInput.value.trim() !== '') {
                this.socket.emit('send-msg', this.roomId, this.$refs.chatInput.value.trim().replace(/(\s+)/g, ' '), this.userPseudo);
                this.$refs.chatInput.value = '';
            }
        },

        hideDisplay(element) {
            this[element] = !this[element];

            if (this.hideChat === false || this.hideUsers === false) {
                this.$refs.chatUsers.classList.add('col-4', 'col-lg-3');
                this.$refs.videoGrid.classList.remove('col-12');
                this.$refs.videoGrid.classList.add('col-8', 'col-lg-9');
                this.$refs.roomFooter.classList.remove('col-12');
                this.$refs.roomFooter.classList.add('col-8', 'col-lg-9');
                if (this.hideChat === false && this.hideUsers === false) {
                    this.$refs.chatUsers.style.gridTemplateRows = '50% 50%';
                } else {
                    this.$refs.chatUsers.style.gridTemplateRows = '100%';
                }
            } else {
                this.$refs.chatUsers.classList.remove('col-4', 'col-lg-3');
                this.$refs.videoGrid.classList.remove('col-8', 'col-lg-9');
                this.$refs.videoGrid.classList.add('col-12');
                this.$refs.roomFooter.classList.remove('col-8', 'col-lg-9');
                this.$refs.roomFooter.classList.add('col-12');
            }
        },

        muteUnmuteAudio(){
            let bool = !this.userStream.getAudioTracks()[0].enabled;
            this.userStream.getAudioTracks()[0].enabled = bool;

            if(bool) {
                this.$refs.microphone.classList.add('fa-microphone');
                this.$refs.microphone.classList.remove('fa-microphone-slash');
            } else {
                this.$refs.microphone.classList.add('fa-microphone-slash');
                this.$refs.microphone.classList.remove('fa-microphone');
            }
        },

        stopPlayVideo() {
            let bool = !this.userStream.getVideoTracks()[0].enabled;
            this.userStream.getVideoTracks()[0].enabled = bool;

            if(bool) {
                this.$refs.video.classList.add('fa-video');
                this.$refs.video.classList.remove('fa-video-slash');
            } else {
                this.$refs.video.classList.add('fa-video-slash');
                this.$refs.video.classList.remove('fa-video');
            }
        },

        addStream(video, cell, stream) {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
            Object.assign(video.style, {position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, objectFit: 'contain'});
            Object.assign(cell.style, {width: '100%', height: 0, position: 'relative', background: 'black', paddingBottom: '50%', border: 'solid 1px #222'});
            cell.appendChild(video);
            this.$refs.videoGrid.appendChild(cell);
        },
    },

    beforeDestroy() {
        if (this.userStream !== false) {
            this.userStream.getTracks().forEach(track => {
                track.stop();
            });
        }

        this.socket.close();
    },

    created() {
        this.roomId = this.$route.params.id;
        this.socket = io.connect('http://localhost:3000');
        this.userPseudo = localStorage.getItem('zoom-pseudo');
        this.peer = new Peer(undefined, {
            path: '/peerjs',
            host: '/',
            port: '3000'
        });

        this.$http.get('http://localhost:3000/find-room', {params: {id: this.$route.params.id}}).then(result => {
            if (result.data.err === undefined) {
                this.roomAvailable = true;

                navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
                    const myVideo = document.createElement('video');
                    const cell = document.createElement('div');
                    cell.classList.add('video-grid__cell');
                    myVideo.muted = true;
                    this.userStream = stream;
                    this.userStream.oninactive = () => { return this.userPseudo };
                    this.nbVideos++;
                    document.querySelector('.room__video-grid').style.gridTemplateColumns = this.nbColumns;
                    this.addStream(myVideo, cell, this.userStream);
                }).catch(error => {
                    console.log(error);
                    this.roomAvailable = false;
                    this.errorMsg = 'Pour vous laisser participer à une réunion, nous avons besoin d\'accéder à votre webcam ainsi que votre microphone. Une fois en réunion, vous pourrez les activer/désactiver à votre guise. Si le navigateur ne vous propose plus de nous autoriser les accès (suite à un premier refus de votre part) il faudra que vous alliez bidouiller les paramètres de votre navigateur. Une fois les permissions données, vous n\'aurez aucun message d\'erreur';
                });
            } else {
                this.roomAvailable = false;
                this.errorMsg = 'Cette réunion n\'existe pas/plus. Vérifiez et réessayez.';
            }
        }).catch(error => {
            this.roomAvailable = false;
            this.errorMsg = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
        });
    },

    mounted() {
        this.peer.on('open', userId => {
            this.socket.emit('join-room', this.roomId, userId, this.userPseudo);
        });

        this.peer.on('call', call => {
            let wait = setInterval(() => {
                if (this.userStream !== false) {
                    call.answer(this.userStream);
                    const remoteVideo = document.createElement('video');
                    const cell = document.createElement('div');
                    cell.dataset.id = call.peer;
                    cell.classList.add('video-grid__cell');
                    this.nbVideos++;
                    document.querySelector('.room__video-grid').style.gridTemplateColumns = this.nbColumns;
                    call.on('stream', remoteStream => {
                        this.addStream(remoteVideo, cell, remoteStream);
                    }, error => {
                        this.roomAvailable = false;
                        this.errorMsg = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
                    });
                    clearInterval(wait);
                }
            }, 250);

        }, error => {
            this.roomAvailable = false;
            this.errorMsg = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
        });

        this.socket.on('new-msg', (user, msg) => {
            const msgDiv = document.createElement('div');
            const msgAuthor = document.createElement('span');
            const msgTime = document.createElement('span');
            const msgContent = document.createElement('p');

            Object.assign(msgDiv.style, {fontSize: '13px', padding: '10px'});
            Object.assign(msgAuthor.style, {width: '70%', float: 'left'});
            Object.assign(msgTime.style, {width: '30%', float: 'right', textAlign: 'right'});
            Object.assign(msgContent.style, {padding: '10px 20px 0 20px', clear: 'both'});


            msgAuthor.innerHTML = `De <b style="color: #0275d8">${user}</b>`;
            msgTime.innerText = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            msgContent.innerText = msg;

            msgDiv.append(msgAuthor, msgTime, msgContent);
            this.$refs.chatOutput.append(msgDiv);
            this.$refs.chatOutput.scrollTop = this.$refs.chatOutput.scrollHeight;
        });

        this.socket.on('user-connected', (remotePeerId, remotePseudo) => {
            const call = this.peer.call(remotePeerId, this.userStream);
            const remoteVideo = document.createElement('video');
            const cell = document.createElement('div');
            cell.classList.add('video-grid__cell');
            cell.dataset.id = remotePeerId;
            this.nbVideos++;
            document.querySelector('.room__video-grid').style.gridTemplateColumns = this.nbColumns;

            call.on('stream', remoteStream => {
                this.addStream(remoteVideo, cell, remoteStream);
            }, error => {
                this.roomAvailable = false;
                this.errorMsg = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
            });

        });

        this.socket.on('user-disconnected', remotePeerId => {
            if (document.querySelector(`[data-id='${remotePeerId}']`) !== null) {
                this.nbVideos--;
                document.querySelector('.room__video-grid').style.gridTemplateColumns = this.nbColumns;
                document.querySelector(`[data-id='${remotePeerId}']`).remove();
            }
        });

        this.socket.on('total-users', allUsers => {
            this.allUsers = allUsers.map(v => {
                v.color = `#${(Math.random() * 1000000).toFixed()}`;
                return v;
            });
            console.log(allUsers);
        });
    },


    components: {
        errorComponent: ErrorComponent
    }
}
</script>

<style lang="scss" scoped>
    .room {
        background-color: #222;
        width: 100%;
        height: 100%;
        margin: 0;
        position: relative;
        overflow: hidden;
    }

    .room__video-grid {
        overflow: hidden;
        display: grid;
        margin-top: auto;
        margin-bottom: auto;
    }

    .room-users-chat {
        background-color: white;
        display: grid;
        height: 100% !important;
        padding: 0;

        .room__users {
            border-top: solid 1px #CCC;
            width: 100%;
            padding-bottom: 45px;

            .users__heading {
                color: black;
                font-weight: 800;
                font-size: 12px;
                text-align: center;
                padding: 5px;
                margin-top: 5px;
                margin-bottom: 15px;
            }

            .users__list {
                overflow-y: scroll;
                font-size: 13px;
                word-break: break-all;
                width: 100%;
                height: 100% !important;
                li {
                    list-style: none;
                    margin: 5px;
                }

                .decorative-square {
                    display: inline-block;
                    text-align: center;
                    vertical-align: middle;
                    margin-right: 10px;
                    width: 20px;
                    height: 20px;
                    border-radius: 5px;
                    font-size: 14px;
                    color: white;
                }
            }
        }

        .room__chat {
            border-top: solid 1px #CCC;
            width: 100%;
            height: 100% !important;
            position: relative;
            padding-bottom: 110px;


            .chat__heading {
                color: black;
                font-weight: 800;
                font-size: 12px;
                text-align: center;
                padding: 5px;
                margin-top: 5px;
                margin-bottom: 5px;
            }

            .chat__output {
                width: 100%;
                height: 100% !important;
                word-break: break-all;
                overflow-y: scroll;
            }

            .chat__input {
                position: absolute;
                bottom: 25px;
                left: 0;
                width: 100%;
                height: 50px;
                padding: 5px 5px 15px 5px;
                border-bottom: solid 1px transparent;
                border-right: solid 1px transparent;
                border-left: solid 1px transparent;
                border-top: solid 1px #CCC;
                font-size: 12px;
                outline: none;
                resize: none;
            }

            .chat__submit {
                position: absolute;
                bottom: 0;
                right: 0;
                font-size: 10px;
                border-radius: 8px;
                outline: none;
                padding: 3px 8px;
                margin: 5px;
                background-color: #0E72ED;
                font-weight: 500;
                color: white;
                border: solid transparent 1px;
                &:hover {
                    background-color: #0c58b4;
                }
                &:active {
                    background-color: #0a4083;
                }
            }
        }
    }

    .room__footer {
        width: 100%;
        margin: 0px;
        background: #1A1A1A;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .controls__icon {
        display: inline-block;
        text-align: center;
        padding: 15px;
        min-width: 40px;
        max-width: 80px;

        i {
            font-size: 22px;
            color: #A8A8A8;
        }

        span {
            font-size: 10px;
            color: #A8A8A8;
        }

        sup {
            margin-left: 5px;
            color: #A8A8A8;
        }


        &:hover {
            background-color: #2E2E2E;
            border-radius: 10px;
            cursor: pointer;

            i, span, sup {
                color: #D5D5D5;
            }

            .fa-video-slash, .fa-microphone-slash {
                color: #DE2828;
            }
        }

        &:active {
            background-color: #424242;

            i, span, sup {
                color: white;
            }
        }

        .fa-video-slash, .fa-microphone-slash {
            color: #B72525;
        }
    }

    .footer__btn {
        background: #B72525;
        font-weight: 600;
        color: white;
        outline: none;
        border: solid 1px transparent;
        border-radius: 10px;
        font-size: 14px;
        padding: 4px 15px;

        &:hover {
            background-color: #de2828;
        }

        &:active {
            background-color: #f52b2b;
        }
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    @media (max-width: 780px) {
    .room__footer {
        padding: 10px 0 10px 0;
    }

    .controls__icon {
        padding: 5px;

        i {
            font-size: 14px;
        }

        span {
            display: none;
        }

        &:hover {
            background-color: inherit;
        }

        &:active {
            background-color: inherit;
        }
    }

    .controls__icon--left {
        text-align: left;
    }

    .controls__icon--right {
        text-align: right;
    }

    .footer__controls {
        padding: 0;
    }

    .footer__btn {
        font-size: 12px;
        padding: 0;
    }
}
</style>