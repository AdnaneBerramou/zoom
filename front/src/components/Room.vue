<template>
    <div>
        <p>{{roomId}}</p>
        <p>{{roomPwd}}</p>
        <p>{{personalId}}</p>
        <p>{{count}}</p>
        <p>{{count2}}</p>
        <div id="video-grid" ref="videoGrid"></div>
        <br>
        <!-- <button @click="active('video')">video</button>
        <button @click="active('audio')">audio</button> -->
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

        // active(media) {
        //     let api = media == 'video' ? 'camera' : 'microphone';

        //     navigator.permissions.query({name:api}).then(resu => {
        //         //handle if permission state denied, explain how to grante the permission
        //         //peut-etre faudra-t-il nester le mediadevices dans le permissions query
        //     });
        // },

        addVideoStream(stream, who, from) {
            let video = document.createElement('video');
            this.count2++;

            Object.assign(video.style, {width: '300px', height: '150px', background: 'black'});
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
            this.$refs.videoGrid.append(video, document.createElement('br'), who, document.createElement('br'));
        },

        connectToNewUser(userId, peer) {
            this.count++;
            navigator.mediaDevices.getUserMedia({
                video: true,
                // audio: true
            }).then(stream => {
                const call = peer.call(userId, stream);
                call.on('stream', remoteStream => {
                    this.addVideoStream(remoteStream, userId, 'calling');
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
                    this.addVideoStream(stream, 'moi', 'mounted');
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
                    this.addVideoStream(remoteStream, call.peer, 'responding');
                })
            })
        }, error => {
            console.log(error);
        });
    }
}


</script>

<style lang="scss" scoped>
</style>