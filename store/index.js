import Vuex from 'vuex';
import Cookie from 'js-cookie';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
      hello: null,
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
      setAuthStatus(state, authStatus) {
        state.authStatus = authStatus;
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      },
      testServerMiddleware(state) {
        return this.$axios.$post(`/api/track-data.json?auth=${state.token}`, { data: 'Authenticated!' });
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
        return this.$axios.$post(`${authURL}?key=${process.env.nbAPIKey}`, {
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

            const token = data.idToken;
            const tokenExpires =  data.expiresIn * 1000;
            const tokenExpirationDate = new Date().getTime() + Number.parseInt(tokenExpires);
            
            // save token and expires date to local storage
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpirationDate', tokenExpirationDate);

            // save token and expires date to cookie
            Cookie.set('token', token);
            Cookie.set('tokenExpirationDate', tokenExpirationDate)

            // test our server middleware
            commit('testServerMiddleware');

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
      },
      initAuth({commit, dispatch}, req) {
        let token;
        let tokenExpirationDate;

        // if load from server
        if (req) {
          if (req.headers.cookie) {
            // get token from cookie
            const jwtCookie = req.headers.cookie
              .split(';')
              .find(c => c.trim().startsWith('token='));

            // set token from cookie
            if (jwtCookie) {
              token = jwtCookie.split('=')[1];
            }

            // get and set expiration date from cookie
            tokenExpirationDate =  req.headers.cookie
              .split(';')
              .find(c => c.trim().startsWith('tokenExpirationDate='))
              .split('=')[1];
          }
        }
        // load from client
        else {
          token = localStorage.getItem('token');
          tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
        }

        // call logout action if token is null or expired
        if (new Date().getTime() > +tokenExpirationDate || !token) {
          console.log('Empty or invalid or expired token');
          dispatch('logout');
          return;
        }

        // set token
        if (token) {
          commit('setToken', token);
        }
      },
      logout({commit}) {
        // clear token & tokenExpirationDate
        // on vuex store, localStorage and session cookie
        commit('clearToken');

        Cookie.remove('token');
        Cookie.remove('tokenExpirationDate');

        // clear local storage on client only
        if (process.client) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpirationDate');
        }
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
        return state.token;
      }
    }
  });
};

export default createStore;