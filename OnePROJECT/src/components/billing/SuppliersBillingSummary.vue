<template>
  <div class="SupplierBillingSummary">
    <div class="mt-0 ml-5 mr-5">
      <b-form-group label-cols-sm="1" label="Select project: ">
        <b-input-group-append class="ml-4">
          <b-form-select class = "b-form-select" v-model="selectedProject"  @change="getAllSuppliersBillingSummaryForProject" size="sm" style="width: 39%;">
            <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project">{{project.projectName}}</option>
            <option slot="first" :value="null">Please Select a Project</option>
          </b-form-select>
        </b-input-group-append>
      </b-form-group>
    </div>
    <div class="mt-0 ml-5 mr-5">
      <b-card class="float-left mr-2 mb-5" v-for="supplier in suppliersSummary" v-bind:key="supplier.supplierId" style="height: 30vh; width: 30%;">
        <h6 slot="header" class="mb-0">{{supplier.supplierName}} <i class="fa fa-circle float-right" :style="getColor(supplier)"/></h6>
        <table>
          <tr><td align="left"><h6>Billing Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplier.totalBillingAmount | numFormat('0.00')}}</td><td style="padding-left: 30px;">{{' ' + supplier.billingPercentage + '%'}}</td></tr>
          <tr><td align="left"><h6>Paid Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplier.totalPaymentAmount | numFormat('0.00')}}</td><td style="padding-left: 30px;">{{' ' + supplier.paymentPercentage + '%'}}</td></tr>
          <tr><td align="left"><h6>Due Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplier.totalDueAmount | numFormat('0.00')}}</td><td style="padding-left: 30px;">{{' ' + supplier.duePercentage + '%'}}</td></tr>
          <tr><td align="left"><h6>Advance Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplier.totalAdvanceAmount | numFormat('0.00')}}</td><td style="padding-left: 30px;">{{' ' + supplier.advPercentage + '%'}}</td></tr>
        </table>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../config.js'
export default {
  name: 'SupplierBillingSummary',

  data () {
    return {
      clientId: 0,
      projectAPI: config.SERVER_URL + 'ProjectEndPoint/',
      supplierBillAPI: config.SERVER_URL + 'SupplierBillEndPoint/',
      allProjects: [],
      selectedProject: null,
      suppliersSummary: []
    }
  },
  methods: {
    getSummarizedProjectsForClient () {
      let self = this
      axios.get(this.projectAPI + 'getSummarizedProjectsForClient' + '/' + this.clientId).then(response => {
        self.allProjects = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getAllSuppliersBillingSummaryForProject: function () {
      let self = this
      axios.get(this.supplierBillAPI + 'getAllSuppliersBillingSummaryForProject' + '/' + this.selectedProject.projectId).then(response => {
        self.suppliersSummary = response.data
        console.log(self.suppliersSummary)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getColor: function (supplier) {
      let color = 'black'
      if (supplier.paymentPercentage > 100) {
        color = 'darkgreen'
      } else if (supplier.paymentPercentage === 100) {
        color = 'green'
      } else if (supplier.paymentPercentage < 100 && supplier.paymentPercentage > 74) {
        color = 'limegreen'
      } else if (supplier.paymentPercentage < 75 && supplier.paymentPercentage > 49) {
        color = 'greenyellow'
      } else if (supplier.paymentPercentage < 50 && supplier.paymentPercentage > 24) {
        color = 'yellow'
      } else if (supplier.paymentPercentage < 25 && supplier.paymentPercentage > 0) {
        color = 'orange'
      } else if (supplier.paymentPercentage < 1) {
        color = 'red'
      }
      return 'color: ' + color + ';'
    }
  },
  mounted () {
    this.clientId = this.$session.get('clientId')
    this.getSummarizedProjectsForClient()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
