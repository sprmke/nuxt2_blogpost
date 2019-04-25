<template>
  <div class="admin-auth-page">
    <div class="auth-container">
      <form @submit.prevent="onSubmit">
        <AppControlInput type="email" v-model="email">E-Mail Address</AppControlInput>
        <AppControlInput type="password" v-model="password">Password</AppControlInput>
        <AppButton type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</AppButton>
        <AppButton
          type="button"
          btn-style="inverted"
          style="margin-left: 10px"
          @click="isLogin = !isLogin">Switch to {{ isLogin ? 'Signup' : 'Login' }}</AppButton>
          <p v-if="authInvalidMessage !== ''" class="error-message">{{authInvalidMessage}}</p>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AdminAuthPage',
  layout: 'admin',
  data() {
    return {
      isLogin: true,
      email: '',
      password: '',
      authInvalidMessage: ''
    }
  },
  methods: {
    onSubmit() {
      // set endpoint if signup or signin
      let authURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser';
      if (this.isLogin) {
        authURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword';
      }

      // submit auth API
      this.$axios.$post(`${authURL}?key=${process.env.rvAPIKey}`, {
          email: this.email,
          password: this.password,
          returnSecureToken: true
        }).then(data => {
          console.log('Auth data::', data);
        }).catch(err => {
          console.log('Auth err::', err);
           if (this.isLogin) {
             this.authInvalidMessage = 'Invalid email or password';
           } else {
             this.authInvalidMessage = 'Email is already exist';
           }
        });
    }
  }
}
</script>

<style scoped>
.admin-auth-page {
  padding: 20px;
}

.auth-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px #ccc;
  width: 300px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
}

.error-message {
  color: red;
}
</style>

