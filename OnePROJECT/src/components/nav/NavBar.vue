<template>
  <main>
    <div id="nav">
      <section class="nav-bar-main">
        <b-tabs style="background-color: lightgray;">
          <b-tab v-for="(item) in mainMenu" :key="item.name" v-on:click="processRequest(item)">
            <template slot="title">
                <i :class="item.icon" style="font-size:90%; color:olive;">{{' '+item.title}}</i>
            </template>
          </b-tab>
        </b-tabs>
        <ul>
          <li v-for="(subMenu, index) in activeSubMenu" :key="subMenu.name">
            <a :id="subMenu.title" v-on:click="processRequest(subMenu)" :style="{ 'background-color':index==0 ? activeSubMenuColor :  inActiveSubMenuColor }"><i :class="subMenu.icon"/>{{' ' + subMenu.title }}</a>
          </li>
        </ul>
        <router-view/>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      color: 'red',
      mainMenu: [
        {
          name: 'Administration',
          title: 'Administration',
          icon: 'fa fa-cogs',
          subMenu: [
            {
              title: 'Admin',
              icon: 'fa fa-bars',
              name: 'Administration',
              path: '/administration'
            },
            {
              title: 'Enumeration Prefences',
              icon: 'fa fa-filter',
              name: 'Enumerations',
              path: '/enumerations'
            }
          ]
        },
        {
          name: 'Projects',
          title: 'Projects',
          icon: 'fa fa-tasks',
          subMenu: [
            {
              title: 'General',
              icon: 'fa fa-bars',
              name: 'ProjectGeneral',
              path: '/projectgeneral'
            },
            {
              title: 'Individuals',
              icon: 'fa fa-male',
              name: 'ProjectIndividuals',
              path: '/projectindividuals'
            },
            {
              title: 'Tools & Machines',
              icon: 'fa fa-truck',
              name: 'ProjectTools',
              path: '/projecttools'
            }
          ]
        },
        {
          name: 'Individuals',
          title: 'Individuals',
          icon: 'fa fa-male',
          subMenu: [
            {
              title: 'Basic',
              icon: 'fa fa-list-alt',
              name: 'IndividualBasic',
              path: '/individualbasic'
            },
            {
              title: 'Communication',
              icon: 'fa fa-address-book',
              name: 'IndividualCommunication',
              path: '/individualcommunication'
            },
            {
              title: 'Due Diligence',
              icon: 'fa fa-id-card',
              name: 'IndividualKYC',
              path: '/individualkyc'
            }
          ]
        },
        {
          name: 'Suppliers',
          title: 'Suppliers',
          icon: 'fa fa-users',
          subMenu: [
            {
              title: 'Capture Supplier',
              icon: 'fa fa-bars',
              name: 'CaptureSupplier',
              path: '/capturesupplier'
            }
          ]
        },
        {
          name: 'Billing',
          title: 'Billing & payments',
          icon: 'fa fa-credit-card',
          subMenu: [
            {
              title: 'Individual',
              icon: 'fa fa-male',
              name: 'IndividualBilling',
              path: '/individualbilling'
            },
            {
              title: 'Supplier',
              icon: 'fa fa-users',
              name: 'SupplierBilling',
              path: '/supplierbilling'
            }
          ]
        },
        {
          name: 'Tooling',
          title: 'Tools & Machines',
          icon: 'fa fa-truck',
          subMenu: [
            {
              title: 'Tooling',
              icon: 'bars',
              name: 'Tooling',
              path: '/tooling'
            }
          ]
        }
      ],
      activeSubMenu: {},
      activeSubMenuColor: 'white',
      inActiveSubMenuColor: '#e5f9e5'

    }
  },
  methods: {
    processRequest (menu) {
      if (menu.subMenu === undefined) {
        for (var i = 0; i < this.activeSubMenu.length; i++) {
          if (menu.title === this.activeSubMenu[i].title) {
            document.getElementById(menu.title).style.backgroundColor = this.activeSubMenuColor
          } else {
            document.getElementById(this.activeSubMenu[i].title).style.backgroundColor = this.inActiveSubMenuColor
          }
        }
        this.$router.push({name: menu.name})
      } else {
        this.activeSubMenu = menu.subMenu
        this.$router.push({name: this.activeSubMenu[0].name})
      }
    }
  },
  mounted () {
    this.activeSubMenu = this.mainMenu[0].subMenu
    this.$router.push({name: this.activeSubMenu[0].name})
  },
  watch: {
  }
}
</script>
<style scoped>
.nav-bar-main {
  background-color:honeydew;
  min-height: 90vh;
  box-shadow: 0px 10px 35px rgba(0, 87, 125, 0.16);
}

b-tab {
  height: 20px;
}

ul {
  list-style-type: none;
  margin-left: 0;
  padding: 0;
  overflow: hidden;
  background-color:c;
}
li {
  float: left;
  padding-right: 5px;
  min-width: 100px;
}
li a{
  display: block;
  color: black;
  text-align: center;
  padding: 5px 5px;
  text-decoration: none;
  font-size:80%;
}
li :hover {
  cursor: pointer;
}

template {
  font-size:80%;
}
</style>
