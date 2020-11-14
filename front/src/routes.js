import Index from './components/Index'
import Room from './components/Room'
import NotFound from './components/NotFound'

export default [
    {path: '/', name: 'index', component: Index},
    {path: '/room/:id([0-9]{11})', name: 'room', component: Room},
    {path: '*', name: '404', component: NotFound}
]