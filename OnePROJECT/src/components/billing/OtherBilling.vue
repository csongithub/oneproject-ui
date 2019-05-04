<template>
  <div class="supplierbilling">
    <div id="project">
    <b-card class="mt-0 ml-5 mr-5 float-left" style="height: 100%; width: 40%;">
      <b-row>
        <b-col>
          <b-form-group label="Select project: ">
            <b-form-select class = "b-form-select" v-model="bill.projectId" size="sm">
              <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project.projectId">{{project.projectName}}</option>
              <option slot="first" :value="null">Please Select a Project</option>
            </b-form-select>
          </b-form-group>
        </b-col>
       </b-row>
       <b-row>
        <b-col>
          <b-form-group class = "date-picker"  id="billingDate" label="Billing Date:" label-for="billingDate" title="Represents date of billing.">
            <date-picker class = "date-picker" v-model="bill.billingDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group class = "billingSummary" label="Total Billing:" label-for="billingDate" title="Represents total billing till date.">
            <span><i class="fa fa-inr"/>{{' '}}{{billingSummary.totalBillingAmount | numFormat('0.00')}}</span>
          </b-form-group>
        </b-col>
      </b-row>
      <form style="background-color: whitesmoke; padding: 5px;">
        <b-row>
          <b-col>
            <b-form-group  :state="validate.itemName" :invalid-feedback="'Enter purpose or item name.'" class="b-form-group" id="itemName" label="Purpose / Item:" label-for="itemName" title="Represents name of the item">
              <b-form-input :state="validate.itemName" :disabled="disabled" size="sm" class="b-form-input mt-2" id="itemName" type="text" v-model="item.itemName" required placeholder="i.e. for milk or nashta"/>
            </b-form-group>
          </b-col>
           <b-col>
            <b-form-group class="b-form-group" id="quantity" label="Quntity (If Applicable):" label-for="quantity" title="Represents quantity of the item">
              <b-form-input :state="validate.quantity" :disabled="disabled" size="sm" class="b-form-input mt-2" id="quantity" type="text" v-model="item.quantity" required placeholder="i.e. 5 KG or 3 Liter"/>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group :state="validate.price" :invalid-feedback="'Enter particular amount.'"  class="b-form-group" id="price" label="Amount (In INR):" label-for="price" title="Represents price of the item">
              <b-form-input :state="validate.price" :disabled="disabled" size="sm" class="b-form-input mt-2" id="price" type="text" v-model="item.price" required placeholder="Enter price of the item"/>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group :state="validate.remark" :invalid-feedback="'Write some comment.'"  class="b-form-group" id="remark" label="Remark:" label-for="remark" title="Represents remark for the item">
              <b-form-input :state="validate.remark" :disabled="disabled" size="sm" class="b-form-input mt-2" id="remark" type="text" v-model="item.remark" required placeholder="Give some reason or comment"/>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col><span class="button float-right" v-on:click="addItem">Add Item</span></b-col>
        </b-row>
      </form>
    </b-card>
    <b-card header="Billing Draft" class="mr-5">
      <b-table class="b-table" style="cursor: default" striped hover responsive :items="items" :fields="fields" :small="true" :fixed="true">
        <template slot="actions" slot-scope="row">
          <!-- <i :class="'fa fa-pencil'" class="ml-1" style="cursor: pointer; color: green" size="sm"/> -->
          <i :class="'fa fa-trash'" class="ml-1" style="cursor: pointer; color: red" size="sm" v-on:click="deleteItem(row.index)"/>
        </template>
        <template slot="table-caption">Total Items: {{items.length}}</template>
      </b-table>
      <span class="button float-right ml-3" v-on:click="saveBill">Save Bill</span>
      <span class="float-right"><b>Total:</b>{{' '}}{{bill.billAmount | numFormat('0.00')}}</span>
    </b-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import {config} from '../../config.js'
import DatePicker from 'vue2-datepicker'
export default {
  name: 'OtherBilling',
  components: {
    'date-picker': DatePicker
  },
  watch: {
    'bill.projectId': function () {
      if (this.bill.projectId === null || this.bill.billingDate === null) {
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.items = []
      this.bill.billAmount = 0
      this.billingSummary = {}
      if (this.bill.projectId !== null) {
        this.getProjectBillingSummary(this.bill.projectId)
      }
    },
    'bill.billingDate': function () {
      if (this.bill.projectId === null || this.bill.billingDate === null) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    }
  },
  data () {
    return {
      baseAPI: config.SERVER_URL + 'OtherBillEndPoint/',
      projectAPI: config.SERVER_URL + 'ProjectEndPoint/',
      clientId: 0,
      allProjects: [],
      selectedProject: null,
      bill: this.getNewBill(),
      items: [],
      item: this.getNewItem(),
      errMsg: null,
      disabled: true,
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
        },
        actions: {
          key: 'actions',
          label: 'Actions'
        }
      },
      validate: this.initiateValidateData(),
      billingSummary: {}
    }
  },
  methods: {
    initiateValidateData: function () {
      return {
        itemName: true,
        price: true,
        quantity: true,
        remark: true
      }
    },
    getNewBill: function () {
      return {
        clientId: null,
        projectId: null,
        billingDate: null,
        itmes: [],
        billAmount: 0
      }
    },
    getNewItem: function () {
      return {
        itemName: null,
        quantity: null,
        price: 0,
        remark: null
      }
    },
    getSummarizedProjectsForClient: function () {
      let self = this
      axios.get(this.projectAPI + 'getSummarizedProjectsForClient' + '/' + this.clientId).then(response => {
        self.allProjects = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    addItem: function () {
      if (this.validateData()) {
        this.bill.billAmount = this.bill.billAmount + Number(this.item.price)
        this.items.push(this.item)
        this.item = this.getNewItem()
      }
    },
    validateData: function () {
      if (this.item.itemName === '' || this.item.itemName === null) {
        this.validate.itemName = false
      } else {
        this.validate.itemName = true
      }
      if (this.item.price === '' || this.item.price === null || this.item.price === 0) {
        this.validate.price = false
      } else {
        this.validate.price = true
      }
      if (this.item.remark === '' || this.item.remark === null) {
        this.validate.remark = false
      } else {
        this.validate.remark = true
      }
      if (this.validate.itemName && this.validate.price && this.validate.remark) {
        return true
      } else {
        return false
      }
    },
    deleteItem: function (index) {
      console.log('delete index: ' + index)
      this.bill.billAmount = this.bill.billAmount - Number(this.items[index].price)
      let temp = []
      let i = 0
      for (let item of this.items) {
        if (i === index) {
          i++
          continue
        } else {
          i++
          temp.push(item)
        }
      }
      this.items = []
      this.$forceUpdate()
      this.items = temp
    },
    saveBill: function () {
      let self = this
      Vue.set(this.bill, 'clientId', this.clientId)
      Vue.set(this.bill, 'items', this.items)
      axios.post(this.baseAPI + 'addBill', this.bill).then(response => {
        self.getProjectBillingSummary(self.bill.projectId)
        self.bill = self.getNewBill()
        self.items = []
        this.$awn.success('Bill Saved Successfully.')
      }).catch(error => {
        this.$awn.alert(error.response.data.message)
      })
    },
    getProjectBillingSummary: function (projectId) {
      let self = this
      axios.get(this.baseAPI + 'getProjectBillingSummary' + '/' + projectId).then(response => {
        self.billingSummary = response.data
      }).catch(error => {
        this.$awn.alert(error.response.data.message)
      })
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
.button {
  color: black;
  cursor: pointer;
  background-color: green;
  padding-left: 3px;
  padding-right: 3px;
  padding-bottom: 2px;
  /* border-radius: 4px; */
  color: white;
}

.button:hover{
  background-color:mediumseagreen;
  color: black;
}

table, th, td {
  border: 1px solid black;
  font-size: 12px;
}
</style>
