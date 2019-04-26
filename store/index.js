import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
      authStatus: ''
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
      },
      setToken(state, token) {
        state.token = token;
      },
      setAuthStatus(state, authStatus) {
        state.authStatus = authStatus;
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
      addPost({state, commit}, post) {
        let createdPost = Object.assign(post, { updatedDate: new Date() });
        return this.$axios.$post(`/posts.json?auth=${state.token}`, createdPost)
          .then(data => {
            // merge createdPost with page params id
            const finalCreatedPost = Object.assign(createdPost, { id: data.name });
            commit('addPost', finalCreatedPost);
          })
          .catch(err => console.log(err));
      },
      editPost({state, commit}, editedPost) {
        return this.$axios.$put(`/posts/${editedPost.id}.json?auth=${state.token}`, editedPost)
        .then(data => {
          const finalEditedPost = data;
          commit('editPost', finalEditedPost);
        })
        .catch(err => console.log(err));
      },
      authenticateUser({commit}, authData) {
        // reset invalid message
        commit('setAuthStatus', {
          message: '',
          status: null
        });

        // set endpoint if signup or signin
        let authURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser';
        if (authData.isLogin) {
          authURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword';
        }

        // submit auth API
        return this.$axios.$post(`${authURL}?key=${process.env.rvAPIKey}`, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(data => {
            console.log('Auth data::', data);

            // show success message
            if (!authData.isLogin) {
              commit('setAuthStatus', {
                message: 'Successfully registered',
                status: 'success'
              });
            }

            // save token
            commit('setToken', data.idToken);

            // return true for success response
            return true;

          }).catch(err => {
            console.log('Auth err::', err);

            // show invalid message
            if (authData.isLogin) {
              commit('setAuthStatus', {
                message: 'Invalid email or password',
                status: 'failed'
              });
            } else {
              commit('setAuthStatus', {
                message: 'Email is already exist',
                status: 'failed'
              });
            }

            // return true for success response
            return false;
          });
      }
    },
    getters: {
      getPosts(state) {
        return state.loadedPosts;
      },
      getAuthStatus(state) {
        return state.authStatus;
      },
      isAuthenticated(state) {
        return state.token !== null;
      }
    }
  });
};

export default createStore;