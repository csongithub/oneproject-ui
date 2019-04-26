<template>
  <div class="header" style="background-color: lightgreen;">
    <b-row>
      <b-col class="text-left">
        <span id="app" class="ml-1">OnePROJECT</span>
      </b-col>
      <b-col cols="auto" class="text-right p-1 mr-3" style="background-color: #4CAF50;">
        <i class="fa fa-user-circle fa-2x" aria-hidden="true">{{' '+user}}</i>
        <!-- <label ></label> -->
        <span id="logout_text" v-on:click="logout">{{'Logout '}}
          <i id="switch_off" class="fa fa-power-off mr-1" aria-hidden="true" v-on:click="logout"/>
        </span>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'custom_header',
  props: {
    user: {
      type: String,
      defalut: ''
    }
  },
  data () {
    return {
    }
  },
  methods: {
    logout: function () {
      this.$emit('logout')
    }
  },
  mounted () {
  },
  created () {
  },
  onIdle () {
    this.$emit('logout')
  },
  onActive () {
  }
}
</script>

<style scoped lang="css">
#app{
  cursor: pointer; font-size: 30px; font-weight: bold;
}
#logout_text{
  cursor: pointer; font-size: 12px; color: blue;
}
#switch_off{
  cursor: pointer; color: blue; font-size: 10px;
}
</style>
