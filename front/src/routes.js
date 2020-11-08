import Home from './components/Home.vue'
import JoinRoom from './components/JoinRoom.vue'
import Room from './components/Room.vue'

export default [
    {path: '/', component: Home},
    {path: '/join', component: JoinRoom},
    {path: '/room/:id([0-9]{11})', component: Room},
    {path: '*', component: Home}
]