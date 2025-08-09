import { createRouter, createWebHistory } from 'vue-router';
import CreateLink from '../pages/CreateLink.vue';
import LinkDetails from '../pages/LinkDetails.vue';

const routes = [
  { path: '/', name: 'create-link', component: CreateLink },
  { path: '/link/:id', component: LinkDetails } // nova rota
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
