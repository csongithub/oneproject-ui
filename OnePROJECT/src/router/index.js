import Vue from 'vue'
import Router from 'vue-router'

import NavBar from '../components/nav/NavBar'
import Login from '../components/nav/Login'

import Administration from '../components/admin/Administration'
import Enumerations from '../components/admin/Enumerations'

import ProjectGeneral from '../components/project/ProjectGeneral'
import ProjectIndividuals from '../components/project/ProjectIndividuals'
import ProjectSuppliers from '../components/project/ProjectSuppliers.vue'
import ProjectMachines from '../components/project/ProjectMachines'

import IndividualBasic from '../components/individual/IndividualBasic'
import IndividualKYC from '../components/individual/IndividualKYC'
import IndividualCommunication from '../components/individual/IndividualCommunication'

import CaptureSupplier from '../components/supplier/CaptureSupplier'

import IndividualBilling from '../components/billing/IndividualBilling'
import SupplierBilling from '../components/billing/SupplierBilling'
import OtherBilling from '../components/billing/OtherBilling'
import MachineBilling from '../components/billing/MachineBilling'
import BillingSummary from '../components/billing/BillingSummary'

import CaptureMachine from '../components/tooling/CaptureMachine'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/navbar',
      name: 'NavBar',
      component: NavBar
    },
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
      path: '/projectsuppliers',
      name: 'ProjectSuppliers',
      component: ProjectSuppliers
    },
    {
      path: '/projectmachines',
      name: 'ProjectMachines',
      component: ProjectMachines
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
      path: '/capturesupplier',
      name: 'CaptureSupplier',
      component: CaptureSupplier
    },
    {
      path: '/supplierbilling',
      name: 'SupplierBilling',
      component: SupplierBilling
    },
    {
      path: '/machinebilling',
      name: 'MachineBilling',
      component: MachineBilling
    },
    {
      path: '/billingsummary',
      name: 'BillingSummary',
      component: BillingSummary
    },
    {
      path: '/otherbilling',
      name: 'OtherBilling',
      component: OtherBilling
    },
    {
      path: '/capturecachine',
      name: 'CaptureMachine',
      component: CaptureMachine
    }
  ]
})
