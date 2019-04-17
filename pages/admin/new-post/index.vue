<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm @onSubmit="onSubmit"/>
    </section>
  </div>
</template>

<script>
  import axios from 'axios';
  import AdminPostForm from '@/components/Admin/AdminPostForm';

  export default {
    name: 'NewPostPage',
    head: {
      title: 'Add new post'
    },
    layout: 'admin',
    components: {
      AdminPostForm
    },
    methods: {
      onSubmit(postData) {
        this.$store.dispatch('addPost', postData)
          .then(() => {
            this.$router.push('/admin');
          })
          .catch(err => console.log(err));
      }
    }
  }
</script>

<style scoped>
  .new-post-form {
    width: 90%;
    margin: 20px auto;
  }

  @media (min-width: 768px) {
    .new-post-form {
      width: 500px;
    }
  }
</style>
