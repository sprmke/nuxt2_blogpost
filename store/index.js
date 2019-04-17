import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(post => {
          return post.id === editedPost.id;
        });
        state.loadedPosts[postIndex] = editedPost;
      }
    },
    actions: {
      nuxtServerInit({commit}, context) {
        return context.app.$axios.$get(`/posts.json`)
          .then(data => {
            let postArray = [];
            for (const key in data) {
              const obj = Object.assign(data[key], { id: key});
              postArray.push(obj);
            }
            commit('setPosts', postArray);
          })
          .catch(err => context.error(err));
      }, 
      setPosts({commit}, posts) {
        commit('setPosts', posts);
      },
      addPost({commit}, post) {
        let createdPost = Object.assign(post, { updatedDate: new Date() });
        return this.$axios.$post(`/posts.json`, createdPost)
          .then(data => {
            // merge createdPost with page params id
            const finalCreatedPost = Object.assign(createdPost, { id: data.name });
            commit('addPost', finalCreatedPost);
          })
          .catch(err => console.log(err));
      },
      editPost({commit}, editedPost) {
        return this.$axios.$put(`/posts/${editedPost.id}.json`, editedPost)
        .then(data => {
          const finalEditedPost = data;
          commit('editPost', finalEditedPost);
        })
        .catch(err => console.log(err));
      } 
    },
    getters: {
      getPosts(state) {
        return state.loadedPosts;
      }
    }
  });
};

export default createStore;