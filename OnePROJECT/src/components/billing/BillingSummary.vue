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
      <div style="overflow: hidden; width: 95%; margin:auto;" v-if="entity === entities[0].name">
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
      <div v-if="entity === entities[2].name">
        <table class="mb-2">
          <tr>
            <td>
              <b-form-select :state="validate.forMonth" class = "b-form-select" v-model="searchCriteria.forMonth" size="sm">
                <option v-for="month in months" v-bind:key="month.value" :value="month.value">{{month.name}}</option>
                <option slot="first" :value="null">Choose Month</option>
              </b-form-select>
            </td>
            <td>
              <b-form-select :state="validate.forYear"  class = "b-form-select" v-model="searchCriteria.forYear" :options="years.map(y=>y.year)" size="sm">
                <option slot="first" :value="null">Choose Year</option>
              </b-form-select>
            </td>
            <td>
              <span id="search" class="fa fa-search" v-on:click="searchByCriteria"></span>
            </td>
            <td>
              <span id="reset" v-on:click="resetData">Reset</span>
            </td>
          </tr>
        </table>
        <div style="overflow: scroll; width: 60%; max-height: 500px; min-height: 450px; margin:auto; background-color: white; margin-right: 5px;" class="float-left">
          <b-card id="item" class="float-left mr-2 mb-5 mt-2 ml-2" v-for="bill in otherBills" v-bind:key="bill.billId" style="height: 22vh; width:18%">
            <h6 slot="header" class="mb-0 float-left">{{bill.billingDate}} <i id="eye" class="ml-1 fa fa-eye float-right" style="cursor: pointer;"   v-on:click="showDetails(bill)"/></h6>
            <table id="table">
              <tr><td align="left">Amount:</td></tr>
              <tr><td align="left"><i class="fa fa-inr"/>{{' '}}{{bill.billAmount | numFormat('0.00')}}</td></tr>
            </table>
            <br>
          </b-card>
          <span id="nobillmessage" v-if="otherBills.length === 0">No Bill Found</span>
        </div>
        <b-card style="margin-left: 2px;">
          <b-row>
            <b-col cols="auto">
              <label><b>Date:</b></label>
            </b-col>
            <b-col cols="auto">
              {{bill.billingDate}}
            </b-col>
            <b-col>
              <i v-if="bill.billId" class="float-right fa fa-edit ml-2" style="cursor:pointer;" v-on:click="showEditBillModal(bill)"></i>
              <i v-if="bill.billId" class="float-right fa fa-trash" style="cursor:pointer; color: red;" v-on:click="deleteBill(bill)"></i>
            </b-col>
          </b-row>
          <b-table class="b-table" style="cursor: default" striped hover responsive :items="bill.items" :fields="fields" :small="true" :fixed="true"></b-table>
           <span class="float-right"><b>Total:</b><i class="fa fa-inr"/>{{' '}}{{bill.billAmount | numFormat('0.00')}}</span>
        </b-card>
      </div>
      <b-modal id="otherbill" ref="otherBillRef" size="lg" @hidden="resetChange">
        <div class="dincomp-bold" slot="modal-title">
          <i class="fa fa-edit"/>Edit Bill
        </div>
        <b-card>
          <b-row>
            <b-col>
              <b-form-group class = "date-picker"  id="billingDate" label="Billing Date:" label-for="billingDate" title="Represents date of billing.">
                <date-picker class = "date-picker" v-model="editableBill.billingDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class = "billingSummary" label="Billing Amount:" label-for="billingDate" title="Represents total billing till date.">
                <span><i class="fa fa-inr"/>{{' '}}{{editableBill.billAmount | numFormat('0.00')}}</span>
              </b-form-group>
            </b-col>
            <b-col></b-col>
            <b-col class="float-right">
              <b-form-group class = "additem" label="" label-for="additem" title="To add a new item click Add">
                <b-button class="b-button btn-sm float-left"  size="sm" variant="success" v-on:click="addItemToBill(editableBill.items)">Add Item <i :class="'fa fa-plus'"/></b-button>
              </b-form-group>
            </b-col>
          </b-row>
          <form style="border:1px;">
            <!-- <b-row>
              <b-col><b-button class="b-button btn-sm float-left"  size="sm" variant="success" v-on:click="addItemToBill(editableBill.items)">Add Item <i :class="'fa fa-plus'"/></b-button></b-col>
            </b-row> -->
            <br>
            <b-container fluid>
              <b-row>
                <b-col cols="auto" class="text-left"></b-col>
                <b-col sm="3" class="text-left ml-2"><span style="color:red;">*</span>Item</b-col>
                <b-col sm="2" class="text-left ml-1">Quantity</b-col>
                <b-col sm="2" class="text-left"><span style="color:red;">*</span>Price</b-col>
                <b-col sm="3" class="text-left"><span style="color:red;">*</span>Remark</b-col>
              </b-row>
              <b-row v-for="(item, index) of editableBill.items" :key="item.itemId">
                <b-col cols="auto" class="text-left">{{index+1}}</b-col>
                <b-col sm="3" class="text-left"><b-form-input size="sm" class="b-form-input" type="text" v-model="item.itemName"></b-form-input></b-col>
                <b-col sm="2" class="text-left"><b-form-input size="sm" class="b-form-input" type="text" v-model="item.quantity"></b-form-input></b-col>
                <b-col sm="2" class="text-left"><b-form-input size="sm" class="b-form-input" type="text" v-model="item.price" v-on:keyup="reCalculateBillAmount"></b-form-input></b-col>
                <b-col sm="3" class="text-left"><b-form-input size="sm" class="b-form-input" type="text" v-model="item.remark"></b-form-input></b-col>
                <b-col sm="1.5" class="text-left"><i class="fa fa-times" aria-hidden="true" style="cursor: pointer; color: gray;" v-on:click="removeItem(editableBill.items, index)"></i></b-col>
              </b-row>
            </b-container>
          </form>
        </b-card>
        <div slot="modal-footer" class="w-100">
          <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click.prevent="updateOtrherBill()">Save</b-button>
          <b-button  type="reset" class="b-button float-right px-2 mr-2" v-on:click="resetChange()">Cancel</b-button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../config.js'
import DatePicker from 'vue2-datepicker'
export default {
  name: 'SupplierBillingSummary',
  components: {
    'date-picker': DatePicker
  },
  watch: {
    'editableBill.items': function (items) {
      console.log(items)
    }
  },
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
      bill: {},
      months: [
        {'name': 'Jan', 'value': 1}, {'name': 'Feb', 'value': 2}, {'name': 'March', 'value': 3}, {'name': 'Apr', 'value': 4}, {'name': 'May', 'value': 5}, {'name': 'June', 'value': 6},
        {'name': 'July', 'value': 7}, {'name': 'Aug', 'value': 8}, {'name': 'Sep', 'value': 9}, {'name': 'oct', 'value': 10}, {'name': 'Nov', 'value': 11}, {'name': 'Dec', 'value': 12}
      ],
      years: [{'year': 2017}, {'year': 2018}, {'year': 2019}, {'year': 2020}, {'year': 2021}, {'year': 2022}, {'year': 2023}, {'year': 2024}, {'year': 2025}],
      searchCriteria: {
        forMonth: null,
        forYear: null
      },
      validate: {
        forMonth: true,
        forYear: true
      },
      editableBill: this.getNewObject()
    }
  },
  methods: {
    getNewObject: function () {
      return {
        billId: null,
        clientId: null,
        projectId: null,
        billingDate: null,
        items: [],
        billAmount: null
      }
    },
    reCalculateBillAmount: function () {
      let items = this.editableBill.items
      let sum = 0
      for (let item of items) {
        sum = sum + Number(item.price)
      }
      this.editableBill.billAmount = sum
    },
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
    searchByCriteria: function () {
      this.validate.forMonth = true
      this.validate.forYear = true
      console.log(this.searchCriteria)
      let self = this
      this.searchCriteria.projectId = this.project.projectId
      if (this.searchCriteria.forMonth !== null && this.searchCriteria.forYear !== null) {
        axios.post(this.otherBillAPI + 'getBillsBySearchCriteria', this.searchCriteria).then(response => {
          self.otherBills = response.data
          console.log(self.otherBills)
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      } else {
        if (this.searchCriteria.forMonth === null) {
          this.validate.forMonth = false
        }
        if (this.searchCriteria.forYear === null) {
          this.validate.forYear = false
        }
      }
    },
    resetData: function () {
      this.searchCriteria.forMonth = null
      this.searchCriteria.forYear = null
      this.getOtherBillsForProjectId()
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
    },
    showEditBillModal: function (bill) {
      let self = this
      axios.get(this.otherBillAPI + 'getBillForProjectAndClientId' + '/' + bill.billId + '/' + bill.clientId + '/' + bill.projectId).then(response => {
        self.editableBill = response.data
        this.$refs.otherBillRef.show()
        console.log(self.editableBill)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    updateOtrherBill: function () {
      if (this.editableBill.billingDate === null || this.editableBill.billingDate === '') {
        this.$awn.alert('Billing date is required')
        return
      }
      if (this.editableBill.items === null || this.editableBill.items.length === 0) {
        this.$awn.alert('Please add items')
        return
      }
      let self = this
      axios.post(this.otherBillAPI + 'addBill', this.editableBill).then(response => {
        self.bill = self.editableBill
        self.editableBill = this.getNewObject()
        self.getOtherBillsForProjectId()
        self.resetChange()
        self.$awn.success('Bill updated successfully')
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    resetChange: function () {
      this.$refs.otherBillRef.hide()
      this.editableBill = this.getNewObject()
    },
    deleteBill: function (bill) {
      let handleConfirm = function () {
        let self = this
        axios.delete(this.otherBillAPI + 'deleteBill' + '/' + bill.billId).then(response => {
          self.$awn.success('Bill deleted successfully')
          self.bill = {}
          self.getOtherBillsForProjectId()
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }.bind(this)
      let handleCancel = function () {
      }
      this.$awn.confirm('Bill will be deleted permanentlly, Are you sure?', handleConfirm, handleCancel)
    },
    removeItem: function (items, index) {
      let handleConfirm = function () {
        items.splice(index, 1)
        this.$forceUpdate()
        this.reCalculateBillAmount()
      }.bind(this)
      let handleCancel = function () {
      }
      this.$awn.confirm('Item will be removed from list, Are you sure?', handleConfirm, handleCancel)
    },
    addItemToBill: function (items) {
      let item = {itemName: null, quantity: null, price: null, remark: null}
      // items.unshift(item)
      items.push(item)
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
.card-header{
  background-color: lightgreen;
}

#search{
color: white;
padding-left: 15px;
padding-right: 15px;
padding-top: 5px;
padding-bottom: 5px;
background-color: green;
cursor: pointer;
}
#reset{
color: white;
padding-left: 5px;
padding-right: 5px;
padding-top: 2px;
padding-bottom: 2px;
background-color: green;
cursor: pointer;
}
#search:hover{
  color: black;
}
#reset:hover{
  color: black;
}
#nobillmessage{
  margin-left: 40%;
  color:darkgray;
}
</style>
