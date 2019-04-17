import Vue from 'vue';

// app
import AppControlInput from '@/components/_App/AppControlInput';
import AppButton from '@/components/_App/AppButton';

// reusable components
import PostList from '@/components/Posts/PostList.vue';

Vue.component('AppControlInput', AppControlInput);
Vue.component('AppButton', AppButton);
Vue.component('PostList', PostList);