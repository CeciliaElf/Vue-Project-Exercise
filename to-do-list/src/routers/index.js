import ToDoList from '../components/todolist.vue'
import ToDoDetails from '../components/tododetails.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '',
        name: 'home',
        component: ToDoList,
    },
    {
        path: '/details/:id/:text',
        name: 'details',
        component: ToDoDetails,
        props: true,
    },
]

export default createRouter({
    history: createWebHistory(),
    routes
})