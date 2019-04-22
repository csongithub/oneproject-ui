<template>
    <div id="login" class="login">
      <b-container>
        <form>
          <div class="namecontainer">
            <label class="name"><b>OnePROJECT</b></label>
          </div>
          <div class="imgcontainer">
            <img src="../../assets/avatar_male_1.png" alt="Avatar" class="avatar">
          </div>
          <div class="container">
            <label for="uname"><b>Username</b></label><br>
            <input type="text" v-model="username" placeholder="Enter Username" required><br>
            <label for="psw"><b>Password</b></label><br>
            <input type="password" v-model="password" placeholder="Enter Password" required><br>
            <button type="submit" v-on:click="authenticateUser">Login</button>
            <label>
              <input type="checkbox" checked="checked"> Remember me
            </label>
            <p v-if="success" style="color: red">{{errorMessage}}</p>
          </div>
          <div class="container" style="background-color:#f1f1f1">
            <button type="button" class="cancelbtn">Cancel</button>
            <span class="psw">Forgot <a href="#">password?</a></span>
          </div>
        </form>
      </b-container>
    </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
// import {config} from '../../main.js'
import {config} from '../../config.js'
export default {
  name: 'Login',
  props: {
  },
  data () {
    return {
      baseAPI: config.SERVER_URL + 'ClientCredentialEndPoint/',
      avatar: '',
      username: '',
      password: '',
      errorMessage: '',
      success: false,
      clientCredential: {}
    }
  },
  methods: {
    authenticateUser: function () {
      this.clientCredential = {}
      Vue.set(this.clientCredential, 'username', this.username)
      Vue.set(this.clientCredential, 'password', this.password)
      axios.post(this.baseAPI + 'authenticateUser', this.clientCredential).then(response => {
        let token = response.data
        console.log(token)
        if (token.authenticated) {
          this.$session.start()
          this.$session.set('clientId', token.clientId)
          this.$emit('login', {'status': true, 'clientId': token.clientId})
        } else {
          this.success = true
          this.errorMessage = 'Invalid Username or Password'
        }
      })
    }
  },
  created () {
    this.username = ''
    this.password = ''
    this.errorMessage = ''
    this.success = false
    this.clientCredential = {}
  },
  mounted () {
  },
  watch: {
  }
}
</script>
<style scoped lang="css">
@import "../../assets/style/login.css";
</style>
