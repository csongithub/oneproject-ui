<template>
  <div class="header" style="background-color: lightgreen;">
    <!--MDB Version of Header-->
    <!-- <mdb-navbar expand="large" dark color="" style="max-height: 50px;">
    <mdb-navbar-brand href="#">
       <span id="app" class="ml-1">OnePROJECT</span><span>{{' '+clientName}}</span>
    </mdb-navbar-brand>
    <mdb-navbar-toggler>
      <mdb-navbar-nav right>
        <mdb-dropdown tag="li" class="nav-item">
          <mdb-dropdown-toggle tag="a" navLink slot="toggle" waves-fixed><mdb-icon class="fa-2x" icon="user-circle"/> {{' ' + user}}</mdb-dropdown-toggle>
          <mdb-dropdown-menu>
            <mdb-dropdown-item v-on:click="logout">logout</mdb-dropdown-item>
          </mdb-dropdown-menu>
        </mdb-dropdown>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
    </mdb-navbar> -->
    <!--Bootstrap Vue Version Header-->
    <b-navbar toggleable="lg" type="light" variant="" style="max-height: 50px;">
      <b-navbar-brand href="#">
        <span id="app" class="ml-1">OnePROJECT</span><span style="color: white;">{{' '+clientName}}</span>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content"><em><i class="fa fa-user-circle-o" aria-hidden="true"></i>{{' ' + user}}</em></template>
            <b-dropdown-item  v-on:click="logout">Log Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!--Custom Version of header-->
    <!-- <b-row>
      <b-col class="text-left">
        <span id="app" class="ml-1">OnePROJECT</span><span>{{' '+clientName}}</span>
      </b-col>
      <b-col cols="auto" class="text-right p-1 mr-3" style="background-color: #4CAF50;">
        <i class="fa fa-user-circle fa-2x" aria-hidden="true">{{' '+user}}</i>
        <span id="logout_text" v-on:click="logout">{{'Logout '}}
          <i id="switch_off" class="fa fa-power-off mr-1" aria-hidden="true" v-on:click="logout"/>
        </span>
      </b-col>
    </b-row> -->
  </div>
</template>

<script>
import { mdbDropdown, mdbDropdownToggle, mdbDropdownMenu, mdbDropdownItem, mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbIcon } from 'mdbvue'
export default {
  name: 'custom_header',
  components: {
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarToggler,
    mdbNavbarNav,
    mdbNavItem,
    mdbContainer,
    mdbDropdown,
    mdbDropdownToggle,
    mdbDropdownMenu,
    mdbDropdownItem,
    mdbIcon
  },
  props: {
    user: {
      type: String,
      defalut: ''
    },
    clientName: {
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
/* @import 'bootstrap-css-only/css/bootstrap.min.css';
@import 'mdbvue/build/css/mdb.css'; */

#app{
  cursor: pointer; font-size: 30px; font-family: 'Bauhaus 93';
}
#logout_text{
  cursor: pointer; font-size: 12px; color: blue;
}
#switch_off{
  cursor: pointer; color: blue; font-size: 10px;
}
</style>
