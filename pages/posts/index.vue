<template>
  <div class="posts-page">
    <PostList :posts="loadedPosts"/>
  </div>
</template>

<script>
  export default {
    middleware: 'log',
    computed: {
      loadedPosts() {
        // get loadedPosts from the store
        return this.$store.getters.getPosts;
      }
    }
  }
</script>