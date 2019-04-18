<template>
    <div id="login" class="login">
      <div class="login_body">
        <div>
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
              <button type="submit" v-on:click="authenticate">Login</button>
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
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      avatar: '',
      username: '',
      password: '',
      errorMessage: '',
      success: false
    }
  },
  methods: {
    authenticate: function () {
      if (this.username === 'testuser' && this.password === 'welcome1') {
        this.$emit('login', {'status': true})
      } else {
        this.success = true
        this.errorMessage = 'Invalid Username or Password'
      }
    }
  },
  created () {
    this.username = ''
    this.password = ''
    this.errorMessage = ''
    this.success = false
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
