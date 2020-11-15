<template>
    <div style="width: 100%; height: 100%;">
        <div class="room container-fluid" v-if="roomAvailable">
            <div class="room__video-grid" ref="videoGrid"></div>
            <div class="room-users-chat" ref="chatUsers">
                <div class="room__chat" v-if="!hideChat" ref="chat">salut chat</div>
                <div class="room__users" v-if="!hideUsers" ref="users">salut participants</div>
            </div>
            <div class="room__footer row d-flex align-items-center justify-content-center">
                <div class="footer__controls col-3 d-flex justify-content-start">
                    <div class="controls__icon" @click="muteUnmuteAudio()"><i class="fas fa-microphone" ref="microphone"></i><br><span>Micro</span></div>
                    <div class="controls__icon" @click="stopPlayVideo()"><i class="fas fa-video" ref="video"></i><br><span>Caméra</span></div>
                </div>

                <div class="footer__controls col-6 d-flex justify-content-center">
                    <div class="controls__icon" @click="test()"><i class="fas fa-shield-alt"></i><br><span>Sécurité</span></div>
                    <div class="controls__icon" @click="hideDisplay('hideUsers')"><i class="fas fa-user-friends"></i><sup>{{nbVideos}}</sup><br><span>Participants</span></div>
                    <div class="controls__icon" @click="hideDisplay('hideChat')"><i class="fas fa-comment-alt"></i><br><span>Converser</span></div>
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
            hideUsers: true
        };
    },

    computed: {
        nbColumns() {
            return 'auto '.repeat(Math.ceil(Math.sqrt(this.nbVideos)));
        }
    },

    methods: {
        test() {
            console.log('click [ OK ]');
            this.socket.emit('disconnect');
        },

        home() {
            this.$router.push({name: 'index'});
        },

        hideDisplay(element) {
            this[element] = !this[element];

            if (this.hideChat === false || this.hideUsers === false) {
                this.$refs.chatUsers.classList.add('col-3');
                this.$refs.videoGrid.classList.add('col-8');
                } else {
                this.$refs.chatUsers.classList.remove('col-3');
                this.$refs.videoGrid.classList.remove('col-8');
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
                video.play()
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
        this.socket = io.connect('http://localhost:3000');
        this.peer = new Peer(undefined, {
            path: '/peerjs',
            host: '/',
            port: '3000'
        });

        this.$http.get('http://localhost:3000/find-room', {params: {id: this.$route.params.id}}).then(result => {
            if (result.data.err === undefined) {
                this.roomAvailable = true;
                this.roomId = this.$route.params.id;
                this.userPseudo = localStorage.getItem('zoom-pseudo');

                navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
                    const myVideo = document.createElement('video');
                    const cell = document.createElement('div');
                    cell.classList.add('video-grid__cell');
                    myVideo.muted = true;
                    this.userStream = stream;
                    this.nbVideos++;
                    console.log('nbvideos++');
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
            this.socket.emit('join-room', this.roomId, userId);
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
                    console.log('nbvideos++');
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

        this.socket.on('user-connected', remotePeerId=> {
            const call = this.peer.call(remotePeerId, this.userStream);
            const remoteVideo = document.createElement('video');
            const cell = document.createElement('div');
            cell.classList.add('video-grid__cell');
            cell.dataset.id = remotePeerId;
            this.nbVideos++;
            console.log('nbvideos++');
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
                console.log('nbvideos--');
                console.log(this.nbColumns);
                document.querySelector('.room__video-grid').style.gridTemplateColumns = this.nbColumns;
                document.querySelector(`[data-id='${remotePeerId}']`).remove();
            }
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
        padding: 0;
        display: flex;
        flex-direction: column;
    }

    .room__video-grid {
        overflow: hidden;
        display: grid;
        margin-top: auto;
    }

    .room__footer {
        width: 100%;
        margin: 0px;
        background: #1A1A1A;
        margin-top: auto;
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

    @media (max-width: 650px) {
    .controls__icon {
        margin: 5px;
        padding: 5px;
        i {
            font-size: 18px;
        }

        span {
            display: none;
        }
    }

    .footer__btn {
        font-size: 12px;
    }
}
</style>