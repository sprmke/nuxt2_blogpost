<template>
  <div class="admin-page">
    <section class="new-post">
      <AppButton @click="$router.push('/admin/new-post')">Create Post</AppButton>
      <AppButton @click="onLogout">Logout</AppButton>
    </section>
    <section class="existing-posts">
      <h1>Existing Posts</h1>
      <PostList :posts="loadedPosts" isAdmin/>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'AdminPage',
    layout: 'admin',
    computed: {
      loadedPosts() {
        // get loadedPosts from the store
        return this.$store.getters.getPosts;
      }
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout');
        this.$router.push('/admin/auth')
      }
    }
  }
</script>

<style scoped>
  .admin-page {
    padding: 20px;
  }

  .new-post {
    text-align: center;
    border-bottom: 2px solid #ccc;
    padding-bottom: 10px;
  }

  .existing-posts h1 {
    text-align: center;
  }
</style>
