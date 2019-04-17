<template>
  <div class="admin-post-page">
    <div class="update-form">
      <AdminPostForm :post="loadedPost" @onSubmit="onSubmit"/>
    </div>
  </div>
</template>

<script>
  import AdminPostForm from '@/components/Admin/AdminPostForm';

  export default {
    name: 'PostIdPage',
    layout: 'admin',
    components: {
      AdminPostForm
    },
    asyncData(context) {
      return context.app.$axios.$get(`/posts/${context.params.postId}.json`)
        .then(data => {
          return {
             loadedPost: { ...data, id: context.params.postId }
          }
        })
        .catch(err => context.error(err));
    },
    methods: {
      onSubmit(editedPost) {
       this.$store.dispatch('editPost', editedPost)
        .then(() => {
          this.$router.push('/admin');
        })
        .catch(err => console.log(err));
      }
    }
  }
</script>

<style scoped>
  .update-form {
    width: 90%;
    margin: 20px auto;
  }

  @media (min-width: 768px) {
    .update-form {
      width: 500px;
    }
  }
</style>