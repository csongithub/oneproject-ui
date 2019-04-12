import Vue from 'vue'
import Router from 'vue-router'

import Administration from '../components/admin/Administration'
import Enumerations from '../components/admin/Enumerations'

import ProjectGeneral from '../components/project/ProjectGeneral'
import ProjectIndividuals from '../components/project/ProjectIndividuals'
import ProjectTools from '../components/project/ProjectTools'

import IndividualBasic from '../components/individual/IndividualBasic'
import IndividualKYC from '../components/individual/IndividualKYC'
import IndividualCommunication from '../components/individual/IndividualCommunication'

import IndividualBilling from '../components/billing/IndividualBilling'
import SupplierBilling from '../components/billing/SupplierBilling'

import Tooling from '../components/tooling/Tooling'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/administration',
      name: 'Administration',
      component: Administration
    },
    {
      path: '/enumerations',
      name: 'Enumerations',
      component: Enumerations
    },
    {
      path: '/projectgeneral',
      name: 'ProjectGeneral',
      component: ProjectGeneral
    },
    {
      path: '/projectindividuals',
      name: 'ProjectIndividuals',
      component: ProjectIndividuals
    },
    {
      path: '/projecttools',
      name: 'ProjectTools',
      component: ProjectTools
    },
    {
      path: '/individualbasic',
      name: 'IndividualBasic',
      component: IndividualBasic
    },
    {
      path: '/individualcommunication',
      name: 'IndividualCommunication',
      component: IndividualCommunication
    },
    {
      path: '/individualkyc',
      name: 'IndividualKYC',
      component: IndividualKYC
    },
    {
      path: '/individualbilling',
      name: 'IndividualBilling',
      component: IndividualBilling
    },
    {
      path: '/supplierbilling',
      name: 'SupplierBilling',
      component: SupplierBilling
    },
    {
      path: '/tooling',
      name: 'Tooling',
      component: Tooling
    }
  ]
})