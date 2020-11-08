<template>
    <div class="main container-fluid">
        <div id="video-grid" ref="videoGrid"></div>
        <div class="chat"></div>
        <div class="controls row align-items-center">
            <div class="col-4 d-flex justify-content-center">
                <div><i class="fas fa-microphone"></i><br><span>Désactiver</span></div>
                <div><i class="fas fa-video"></i><br><span>Désactiver</span></div>
            </div>

            <div class="col-4 d-flex justify-content-center">
                <div><i class="fas fa-shield-alt"></i><br><span>Sécurité</span></div>
                <div><i class="fas fa-user-friends"></i><br><span>Participants</span></div>
                <div><i class="fas fa-comment-alt"></i><br><span>Converser</span></div>
            </div>

            <button class="offset-2 col-1">Fin</button>
        </div>
    </div>
</template>

<script scoped>
export default {

    data() {
        return {
            roomId: null,
            roomPwd: null,
            personalId: null,
            roomAvailable: false,
            count: 0,
            count2: 0
        };
    },

    methods: {

        muteUnmute(){

        },

        // active(media) {
        //     let api = media == 'video' ? 'camera' : 'microphone';

        //     navigator.permissions.query({name:api}).then(resu => {
        //         //handle if permission state denied, explain how to grante the permission
        //         //peut-etre faudra-t-il nester le mediadevices dans le permissions query
        //     });
        // },

        addVideoStream(stream/*, who, from*/) {
            let video = document.createElement('video');
            this.count2++;

            Object.assign(video.style, {width: '300px', height: '150px', background: 'black'});
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
            this.$refs.videoGrid.append(video);
            // this.$refs.videoGrid.append(video, document.createElement('br'), who, document.createElement('br'));
        },

        connectToNewUser(userId, peer) {
            this.count++;
            navigator.mediaDevices.getUserMedia({
                video: true,
                // audio: true
            }).then(stream => {
                const call = peer.call(userId, stream);
                call.on('stream', remoteStream => {
                    // this.addVideoStream(remoteStream/*, userId, 'calling'*/);
                }, error => {
                    console.log(error);
                });
            })
        }
    },

    mounted() {
        const socket = io.connect('http://localhost:3000');
        const peer = new Peer(undefined, {
            path: '/peerjs',
            host: '/',
            port: '3000'
        });

        this.$http.get('http://localhost:3000/find-room', {
            params: {
                id: this.$route.params.id
            }
        }).then(result => {
            if (result.data.err !== undefined) {
                console.log('Chambre inexistante');
            } else {
                this.roomId = result.data.id;
                this.roomPwd = result.data.pwd;
                this.roomAvailable = true;

                navigator.mediaDevices.getUserMedia({
                    video: true,
                    // audio: true
                }).then(stream => {
                    // this.addVideoStream(stream/*, 'moi', 'mounted'*/);
                }).catch(error => {
                    console.log(error);
                });

                peer.on('open', personalId => {
                    socket.emit('join-room', this.roomId, personalId);
                    this.personalId = personalId;
                });

            }
        }).catch(error => {
            console.log(error);
        });


        socket.on('new-user', userId => {
            console.log('new user => ' + userId);
            this.connectToNewUser(userId, peer);
        });

        peer.on('call', call => {
            navigator.mediaDevices.getUserMedia({
                video: true,
                // audio: true
            }).then(stream => {
                call.answer(stream);
                call.on('stream', remoteStream => {
                    // this.addVideoStream(remoteStream/*, call.peer, 'responding'*/);
                })
            })
        }, error => {
            console.log(error);
        });
        window.onbeforeunload = () => {
            this.$http.get('http://localhost:3000/test').then(result => {
                console.log(result);
            }).catch(error => {
                console.log(error);
            });
            document.body.style.background = 'blue';
        }
    }
}
</script>

<style lang="scss" scoped>
    .controls {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        margin: 0px;
        background: #1A1A1A;
        height: 80px;
        div {
            div {
                display: inline-block;
                padding: 15px;
                text-align: center;
                i {
                    font-size: 22px;
                    color: #A8A8A8;
                }
                span {
                    font-size: 10px;
                    color: #A8A8A8;
                }
                &:hover {
                    i,span {
                        color: #D5D5D5;
                    }
                    background-color: #2E2E2E;
                    border-radius: 10px;
                    cursor: pointer;
                }
            }
        }
        button {
            background: #B72525;
            font-weight: 600;
            color: white;
            outline: none;
            border: solid 1px transparent;
            border-radius: 10px;
            font-size: 14px;
            padding: 4px 15px;
            &:hover {
                background-color: #DE2828;
            }
        }
    }

</style>