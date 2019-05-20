<template>
  <div>
    <div class="mt-0 ml-5 mr-5">
      <b-row>
        <b-col cols="5">
          <b-form-group label="Select Project: ">
            <b-form-select class = "b-form-select" v-model="project"  @change="fetchEntityBillingSummary" size="sm">
              <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project">{{project.projectName}}</option>
              <option slot="first" :value="null">Select Project</option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="auto">
          <b-form-group label="Select Entity: ">
            <b-form-select class = "b-form-select" v-model="entity" @change="fetchEntityBillingSummary" :options="entities.map(e=>e.name)" size="sm">
              <option slot="first" :value="null">Select Entity</option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <div style="overflow: hidden; width: 95%; margin:auto;" v-if="suppliersSummary !== null && suppliersSummary.length > 0">
        <b-card class="float-left mr-2 mb-5" v-for="supplier in suppliersSummary" v-bind:key="supplier.supplierId" style="height: 30vh; width:30%">
          <h6 slot="header" class="mb-0">{{supplier.supplierName}} <i class="fa fa-circle float-right" :style="getColor(supplier)"/></h6>
          <table>
            <tr><td align="left"><h6>Billing Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplier.totalBillingAmount | numFormat('0.00')}}</td><td style="padding-left: 30px;">{{' ' + supplier.billingPercentage + '%'}}</td></tr>
            <tr><td align="left"><h6>Paid Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplier.totalPaymentAmount | numFormat('0.00')}}</td><td style="padding-left: 30px;">{{' ' + supplier.paymentPercentage + '%'}}</td></tr>
            <tr><td align="left"><h6>Due Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplier.totalDueAmount | numFormat('0.00')}}</td><td style="padding-left: 30px;">{{' ' + supplier.duePercentage + '%'}}</td></tr>
            <tr><td align="left"><h6>Advance Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplier.totalAdvanceAmount | numFormat('0.00')}}</td><td style="padding-left: 30px;">{{' ' + supplier.advPercentage + '%'}}</td></tr>
          </table>
        </b-card>
      </div>
      <div v-if="otherBills !== null && otherBills.length > 0">
        <div style="overflow: scroll; width: 60%; max-height: 500px; margin:auto; background-color: white; margin-right: 5px;" class="float-left">
          <b-card id="item" class="float-left mr-2 mb-5 mt-2 ml-2" v-for="bill in otherBills" v-bind:key="bill.billId" style="height: 22vh; width:18%">
            <h6 slot="header" class="mb-0 float-left">{{bill.billingDate}}</h6>
            <table id="table">
              <tr><td align="left">Amount:</td></tr>
              <tr><td align="left"><i class="fa fa-inr"/>{{' '}}{{bill.billAmount | numFormat('0.00')}}</td></tr>
            </table>
            <br>
            <i id="eye" class="fa fa-eye float-right" style="color: green; cursor:pointer;"  v-on:click="showDetails(bill)"></i>
          </b-card>
        </div>
        <b-card style="margin-left: 2px;">
          <b-row>
            <b-col cols="auto">
              <label><b>Date:</b></label>
            </b-col>
            <b-col cols="auto">
              {{bill.billingDate}}
            </b-col>
          </b-row>
          <b-table class="b-table" style="cursor: default" striped hover responsive :items="bill.items" :fields="fields" :small="true" :fixed="true"></b-table>
           <span class="float-right"><b>Total:</b><i class="fa fa-inr"/>{{' '}}{{bill.billAmount | numFormat('0.00')}}</span>
        </b-card>
      </div>
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
      otherBillAPI: config.SERVER_URL + 'OtherBillEndPoint/',
      allProjects: [],
      entities: [{'name': 'Supplier'}, {'name': 'Machine'}, {'name': 'Other'}],
      entity: null,
      project: null,
      suppliersSummary: [],
      otherBills: [],
      fields: {
        itemName: {
          label: 'Purpose / Item Name',
          sortable: true
        },
        quantity: {
          label: 'Quantity'
        },
        price: {
          label: 'Amount',
          sortable: true
        },
        remark: {
          label: 'Remark'
        }
      },
      bill: {}
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
    fetchEntityBillingSummary: function () {
      if (this.project !== null && this.entity !== null) {
        this.suppliersSummary = []
        this.otherBills = []
        if (this.entity === this.entities[0].name) {
          this.getAllSuppliersBillingSummaryForProject()
        } else if (this.entity === this.entities[2].name) {
          this.getOtherBillsForProjectId()
        }
      }
    },
    getAllSuppliersBillingSummaryForProject: function () {
      let self = this
      axios.get(this.supplierBillAPI + 'getAllSuppliersBillingSummaryForProject' + '/' + this.project.projectId).then(response => {
        self.suppliersSummary = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getOtherBillsForProjectId: function () {
      let self = this
      axios.get(this.otherBillAPI + 'getBillsForProjectId' + '/' + this.project.projectId).then(response => {
        self.otherBills = response.data
        console.log(self.otherBills)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    showDetails: function (bill) {
      this.bill = bill
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
#eye:hover{
  box-shadow: 0px 0px 10px 4px rgba(131,230,162,0.48);
}

.card-header{
  background-color: lightgreen;
}
</style>
