<template>
  <div class="supplierbilling">
    <div id="project">
    <b-card class="mt-0 ml-5 float-left" style="height: 30vh; width: 40%;">
      <b-form-group label="Select project: ">
          <b-form-select class = "b-form-select" v-model="selectedProject"  @change="getProjectSuppliers" size="sm">
            <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project">{{project.projectName}}</option>
            <option slot="first" :value="null">Please Select a Project</option>
          </b-form-select>
      </b-form-group>
      <b-form-group label-cols-sm="auto" label="Select Supplier: ">
          <b-form-select class = "b-form-select" v-model="selectedSupplier" @change="getSupplierBillingSummaryForProject" size="sm">
            <option v-for="supplier in projectSuppliers" v-bind:key="supplier.id" :value="supplier">{{supplier.supplierName}}</option>
            <option slot="first" :value="null">Please Select a Project</option>
          </b-form-select>
      </b-form-group>
      <label v-if="errMsg" style="color: red;">{{errMsg}}</label>
      <span class="button float-right" v-on:click="goToBilling">Go To Billing</span>
    </b-card>
    <b-card class="float-right mr-5"  style="height: 30vh; width: 40%;" header="Billing Summary">
      <table v-if="selectedProject && selectedSupplier">
        <tr><td align="right"><h6>Billing Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplierBillingSummary.totalBillingAmount | numFormat('0.00')}}</td><td>{{' ' + supplierBillingSummary.billingPercentage + '%'}}</td></tr>
        <tr><td align="right"><h6>Paid Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplierBillingSummary.totalPaymentAmount | numFormat('0.00')}}</td><td>{{' ' + supplierBillingSummary.paymentPercentage + '%'}}</td></tr>
        <tr><td align="right"><h6>Due Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplierBillingSummary.totalDueAmount | numFormat('0.00')}}</td><td>{{' ' + supplierBillingSummary.duePercentage + '%'}}</td></tr>
        <tr><td align="right"><h6>Advance Amount:</h6></td><td><i class="fa fa-inr"/>{{' '}}{{supplierBillingSummary.totalAdvanceAmount | numFormat('0.00')}}</td>{{' ' + supplierBillingSummary.advPercentage + '%'}}<td></td></tr>
      </table>
      <p v-if="!selectedProject || !selectedSupplier" class="mt-5" style="margin-left: 30%; color: lightgray;">Please Select projetc and supplier</p>
    </b-card>
    </div>
    <div v-if="selectedProject && selectedSupplier" id="billing" style="display: none;" class="mt-0 ml-5 mr-5">
      <i class="fa fa-long-arrow-left fa-2x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="goToProject"></i>
      <i class="fa fa-print float-right fa-1x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="print">{{' ' + 'Print'}}</i>
      <div id="printable">
        <b-form>
          <b-card :header="'Billing Summary - ' + client" bg-variant="light">
            <b-row>
              <b-col>
                <label><b>Project:</b> {{selectedProject.projectName}}</label>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <label><b>Supplier:</b> {{selectedSupplier.supplierName}}</label>
              </b-col>
              <b-col>
                <label><b>Owner:</b> {{selectedSupplier.owner}}</label>
              </b-col>
              <b-col>
                <label><b>Materials:</b> {{selectedSupplier.materials}}</label>
              </b-col>
              <b-col></b-col>
            </b-row>
            <b-row>
              <b-col>
                <label><b>Billing Amount:</b><i class="fa fa-inr"/>{{' '}}{{supplierBillingSummary.totalBillingAmount | numFormat('0.00')}}{{' (' + supplierBillingSummary.billingPercentage + '%)'}}</label>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Paid Amount:</b><i class="fa fa-inr"/>{{' '}}{{ supplierBillingSummary.totalPaymentAmount | numFormat('0.00')}}{{' (' + supplierBillingSummary.paymentPercentage + '%)'}}</label>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Due Amount:</b><i class="fa fa-inr"/>{{' '}}{{supplierBillingSummary.totalDueAmount | numFormat('0.00')}}{{' (' + supplierBillingSummary.duePercentage + '%)'}}</label>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Advance Amount:</b><i class="fa fa-inr"/>{{' '}}{{supplierBillingSummary.totalAdvanceAmount | numFormat('0.00')}}{{' (' + supplierBillingSummary.advPercentage + '%)'}}</label>
                </b-form-group>
              </b-col>
            </b-row>
            <div>
              <i id="paymentHistory" style="cursor: pointer; color: blue;" v-on:click="showPaymentHistory = !showPaymentHistory" :class="!showPaymentHistory ? 'fa fa-plus' : 'fa fa-minus'">{{showHideHistorytext}}</i>
              <div :style="showPaymentHistory ? 'display : block; border: 1px solid lightgreen;' : 'display : none;'">
                <label style="color: blue; font-size: 30; font-weight: bold;">Billing History</label>
                <b-table class="b-table" style="cursor: default" striped hover responsive :items="bills" :fields="billFields" :small="true" :fixed="true"></b-table>
                <hr>
                <label style="color: blue; font-size: 30; font-weight: bold;">Payment History</label>
                <b-table class="b-table" style="cursor: default" striped hover responsive :items="payments" :fields="paymentFields" :small="true" :fixed="true"></b-table>
              </div>
            </div>
          </b-card>
        </b-form>
      </div>
      <br>
      <b-form title="Do supplier payment here" style="background-color: lightgreen; padding: 10px">
        <b-row>
          <b-col cols="auto">
            <b-form-group id="reason" label="Payment Reason:" label-for="reason" title="Represents payment reason.">
              <b-form-select class = "b-form-select" v-model="supplierBill.reason" :options="reasons.map(a=>a.name)" size="sm">
                <option slot="first" :value="null">Choose</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <div v-if="supplierBill.reason === reasons[0].name">
          <b-row>
            <b-col>
              <b-form-group class="b-form-group" id="rate" label="Check this if rate is known." label-for="rate" title="Represents weather rate is known or not.">
                <b-form-checkbox id="checkbox-1" v-model="supplierBill.rateAvailable" name="checkbox-1" value="rated" unchecked-value="not_rated">
                  Billing by rate.
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.rate" :invalid-feedback="'Enter material rate.'" class="b-form-group" id="rate" label="Enter Rate (Per Unit)" label-for="rate" title="Represents rate of material.">
                <b-form-input :disabled="disabled" :state="validate.rate" size="sm" class="b-form-input mt-2" id="rate" type="text" v-model="supplierBill.rate" required placeholder="i.e 267.57"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.quantity" :invalid-feedback="'Enter material quantity.'" class="b-form-group" id="quantity" label="Enter Quantity of Material(s):" label-for="quantity" title="Represents quantity of material purchaged.">
                <b-form-input :disabled="disabled" :state="validate.quantity" size="sm" class="b-form-input mt-2" id="billAmount" type="text" v-model="supplierBill.quantity" required placeholder="i.e 15KG or 50 Liters or 100 Bags "/>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.billingDate" :invalid-feedback="'Select billing date.'" class = "date-picker"  id="paymentDate" label="Billing Date:" label-for="billingDate" title="Represents date of billing.">
                <date-picker class = "date-picker" v-model="supplierBill.billingDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.billAmount" :invalid-feedback="'Enter ailling amount.'" class="b-form-group" id="billAmount" label="Enter Bill Amount(In INR):" label-for="billAmount" title="Represents total amount of bill.">
                <b-form-input :disabled="!disabled" :state="validate.billAmount" size="sm" class="b-form-input mt-2" id="billAmount" type="text" v-model="supplierBill.billAmount" required placeholder="Enter Bill Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount.'" class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.paidAmount" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="supplierBill.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Select payment date.'" class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker :disabled="validate.zeroPayment" class = "date-picker" v-model="supplierBill.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :disabled="validate.zeroPayment" :state="validate.mode" class = "b-form-select" v-model="supplierBill.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.material" :invalid-feedback="'Select Material(s).'" id="material" label="Slecte Material(s):" label-for="material" title="Represents purchached material.">
                <multiselect v-model="supplierBill.materialsArray" :options="matterialArray" :multiple="true" placeholder="Select material(s)">
                </multiselect>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.comment" :invalid-feedback="'Write some comment.'"  class="b-form-group" id="remark" label="Remark:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.comment" id="textarea" v-model="supplierBill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class="b-form-group" id="dueAmount" label="Due Amount(in INR):" label-for="dueAmount" title="Represents due bill amount.">
               <label><i class="fa fa-inr"/>{{' '}}{{supplierBill.dueAmount |numFormat('0.00')}}</label>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <label class="float-left" v-if="validate.errorMessage" style="color: red;">{{validate.errorMessage}}</label>
              <span class="button float-right" v-on:click="makePayment">Make Payment</span>
            </b-col>
          </b-row>
        </div>
        <div v-if="supplierBill.reason === reasons[1].name">
          <b-row>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount'" class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.paidAmount" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="supplierBill.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Please select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" class = "b-form-select" v-model="supplierBill.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Please select payment date.'" class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker class = "date-picker" v-model="supplierBill.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.comment" invalid-feedback="Write some comment." class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.comment" id="textarea" v-model="supplierBill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class="b-form-group" id="dueAmount" label="Remainig Due Amount(in INR):" label-for="dueAmount" title="Represents due bill amount.">
               <label><i class="fa fa-inr"/>{{' '}}{{supplierBillingSummary.totalDueAmount - supplierBill.paidAmount | numFormat('0.00')}}</label>
              </b-form-group>
            </b-col>
            <b-col></b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <label class="float-left" v-if="validate.errorMessage" style="color: red;">{{validate.errorMessage}}</label>
              <span class="button float-right" v-on:click="makePayment">Make Payment</span>
            </b-col>
          </b-row>
        </div>
        <div v-if="supplierBill.reason === reasons[2].name">
          <b-row>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount'" class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents advance amount to be paid.">
                <b-form-input :state="validate.paidAmount" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="supplierBill.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Please select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" class = "b-form-select" v-model="supplierBill.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Please select payment date.'" class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker class = "date-picker" v-model="supplierBill.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
             <b-col>
              <b-form-group :state="validate.material" :invalid-feedback="'Select Material(s).'" id="material" label="Slecte Material(s):" label-for="material" title="Represents purchached material.">
                <multiselect v-model="supplierBill.materialsArray" :options="matterialArray" :multiple="true" placeholder="Select material(s)">
                </multiselect>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class="b-form-group" id="quantity" label="Enter Quantity of Material(s):" label-for="quantity" title="Represents quantity of material purchaged.">
                <b-form-input :state="validate.quantity" size="sm" class="b-form-input mt-2" id="billAmount" type="text" v-model="supplierBill.quantity" required placeholder="i.e 15KG or 50 Liters or 100 Bags "/>
              </b-form-group>
            </b-col>
            <b-col></b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.comment" invalid-feedback="Write some comment." class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.comment" id="textarea" v-model="supplierBill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col></b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <label class="float-left" v-if="validate.errorMessage" style="color: red;">{{validate.errorMessage}}</label>
              <span class="button float-right" v-on:click="makePayment">Make Payment</span>
            </b-col>
          </b-row>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import {config} from '../../config.js'
import DatePicker from 'vue2-datepicker'
import ResultTable from '../common/ResultTable'
export default {
  name: 'SupplierBilling',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  data () {
    return {
      baseAPI: config.SERVER_URL + 'ProjectEndPoint/',
      supplierAPI: config.SERVER_URL + 'SupplierEndPoint/',
      billingAPI: config.SERVER_URL + 'SupplierBillEndPoint/',
      clientId: 0,
      client: null,
      allProjects: [],
      selectedProject: null,
      projectSuppliers: [],
      selectedSupplier: null,
      errMsg: null,
      reasons: [{'name': 'New Bill'}, {'name': 'Due Payment'}, {'name': 'Advance Payment'}],
      modes: [{'name': 'Cash'}, {'name': 'Card'}, {'name': 'Cheque'}, {'name': 'Account Transfer'}],
      supplierBill: this.getNewBill(),
      matterialArray: [],
      supplierBillingSummary: {'totalBillingAmount': 0.0, 'totalPaymentAmount': 0.0, 'totalDueAmount': 0.0, 'totalAdvanceAmount': 0.0},
      showPaymentHistory: false,
      showHideHistorytext: 'Payment History',
      bills: [],
      payments: [],
      billFields: {
        billingDate: {
          label: 'Billing Date',
          sortable: true
        },
        paymentDate: {
          label: 'Payment Date',
          sortable: true
        },
        billAmount: {
          label: 'Bill Amount',
          sortable: true
        },
        paidAmount: {
          label: 'Paid Amount',
          sortable: true
        },
        dueAmount: {
          label: 'Due Amount',
          sortable: true
        },
        mode: {
          label: 'Payment Mode',
          sortable: true
        },
        materials: {
          label: 'Materials',
          sortable: false
        },
        rate: {
          label: 'Rate',
          sortable: false
        },
        quantity: {
          label: 'Quantity',
          sortable: false
        },
        comment: {
          label: 'Remark',
          sortable: false
        }
      },
      paymentFields: {
        reason: {
          label: 'Reason',
          sortable: true
        },
        paymentDate: {
          label: 'Payment Date',
          sortable: true
        },
        paidAmount: {
          label: 'Paid Amount',
          sortable: true
        },
        mode: {
          label: 'Payment Mode',
          sortable: true
        },
        materials: {
          label: 'Materials',
          sortable: false
        },
        comment: {
          label: 'Remark',
          sortable: false
        }
      },
      validate: this.initiateValidateData(),
      disabled: false
    }
  },
  watch: {
    'supplierBill.rateAvailable': function (value) {
      if (value === 'not_rated') {
        this.disabled = true
        this.supplierBill.rate = 0.0
        this.supplierBill.quantity = 0.0
        this.validate.rate = true
        this.validate.quantity = true
      } else if (value === 'rated') {
        this.disabled = false
      }
    },
    'supplierBill.rate': function (value) {
      this.supplierBill.billAmount = (this.supplierBill.rate * this.supplierBill.quantity).toFixed(2)
    },
    'supplierBill.quantity': function (value) {
      this.supplierBill.billAmount = (this.supplierBill.rate * this.supplierBill.quantity).toFixed(2)
    },
    'supplierBill.paidAmount': function (value) {
      if (this.supplierBill.reason === this.reasons[0].name) {
        if (value > 0) {
          this.validate.zeroPayment = false
        } else {
          this.validate.zeroPayment = true
        }
        this.supplierBill.dueAmount = this.supplierBill.billAmount - this.supplierBill.paidAmount
      }
    },
    'supplierBill.billAmount': function () {
      if (this.supplierBill.reason === this.reasons[0].name) {
        this.supplierBill.dueAmount = this.supplierBill.billAmount - this.supplierBill.paidAmount
      }
    },
    selectedProject: function () {
      if (this.selectedProject === null) {
        this.projectSuppliers = []
      }
    },
    'supplierBill.reason': function (reason) {
      this.validate.zeroPayment = true
      this.validate = this.initiateValidateData()
      this.supplierBill = this.getNewBill()
      this.supplierBill.reason = reason
    }
  },
  methods: {
    getNewBill: function () {
      return {
        billId: null,
        supplierId: null,
        projectId: null,
        reason: 'New Bill',
        billAmount: 0.0,
        paidAmount: 0.0,
        dueAmount: 0.0,
        paymentDate: null,
        billingDate: null,
        materialsArray: [],
        materials: null,
        comment: null,
        mode: null,
        quantity: null,
        rate: 0.0,
        rateAvailable: 'rated'
      }
    },
    initiateValidateData: function () {
      return {
        billAmount: true,
        paidAmount: true,
        mode: true,
        paymentDate: true,
        material: true,
        quantity: true,
        rate: true,
        comment: true,
        errorMessage: null,
        zeroPayment: true
      }
    },
    getSummarizedProjectsForClient () {
      let self = this
      axios.get(this.baseAPI + 'getSummarizedProjectsForClient' + '/' + this.clientId).then(response => {
        self.allProjects = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getProjectSuppliers () {
      let self = this
      let projectId = this.selectedProject.projectId
      axios.get(this.baseAPI + 'getProjectSuppliers' + '/' + projectId).then(response => {
        self.projectSuppliers = response.data
        console.log(self.projectSuppliers)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
      this.getSupplierBillingSummaryForProject()
    },
    goToBilling: function () {
      if (this.selectedProject && this.selectedSupplier) {
        this.showPaymentHistory = false
        this.errMsg = null
        document.getElementById('project').style.display = 'none'
        document.getElementById('billing').style.display = 'block'
        this.getSupplier()
        this.postPayment()
      } else {
        this.errMsg = 'Please select project and supplier'
      }
    },
    goToProject: function () {
      this.getSupplierBillingSummaryForProject()
      document.getElementById('billing').style.display = 'none'
      document.getElementById('project').style.display = 'block'
    },
    getSupplier: function () {
      let self = this
      axios.get(this.supplierAPI + 'getSupplierById' + '/' + this.selectedSupplier.id).then(response => {
        let o = response.data
        console.log(o)
        let matterials = o.materials
        self.matterialArray = matterials.split(',')
        console.log(self.matterialArray)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getSupplierBillingSummaryForProject: function () {
      let self = this
      if (this.selectedProject !== null && this.selectedSupplier !== null) {
        axios.get(this.billingAPI + 'getSupplierBillingSummaryForProject' + '/' + this.selectedProject.projectId + '/' + this.selectedSupplier.id).then(response => {
          let o = response.data
          this.supplierBillingSummary = o
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }
    },
    getBillsForProjectAndSupplier: function () {
      let self = this
      if (this.selectedProject !== null && this.selectedSupplier !== null) {
        axios.get(this.billingAPI + 'getBillsForProjectAndSupplier' + '/' + this.selectedProject.projectId + '/' + this.selectedSupplier.id).then(response => {
          let allBills = response.data
          self.bills.splice(0, self.bills.length)
          self.payments.splice(0, self.payments.length)
          if (allBills.length > 0) {
            for (let bill of allBills) {
              if (bill.reason === self.reasons[0].name) {
                self.bills.push(bill)
              } else {
                self.payments.push(bill)
              }
            }
          }
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }
    },
    makePayment: function () {
      let self = this
      let materials = ''
      for (let m of this.supplierBill.materialsArray) {
        materials = materials + ', ' + m
      }
      Vue.set(this.supplierBill, 'materials', materials.slice(1))
      Vue.set(this.supplierBill, 'supplierId', this.selectedSupplier.id)
      Vue.set(this.supplierBill, 'projectId', this.selectedProject.projectId)
      if (this.validatePayment(this.supplierBill)) {
        axios.post(this.billingAPI + 'addBill', this.supplierBill).then(response => {
          this.postPayment()
          self.$awn.success('Payment Done')
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }
    },
    postPayment: function () {
      this.supplierBill = this.getNewBill()
      this.getBillsForProjectAndSupplier()
      this.getSupplierBillingSummaryForProject()
      this.validate = this.initiateValidateData()
    },
    validatePayment: function (bill) {
      if (bill.reason === this.reasons[0].name) {
        if (bill.billingDate === 'undefined' || bill.billingDate === null || bill.billingDate === '') {
          this.validate.billingDate = false
        } else {
          this.validate.billingDate = true
        }
        this.$forceUpdate()
        if (bill.rateAvailable === 'rated') {
          if (bill.rate === '' || bill.rate === null || bill.rate === 0) {
            this.validate.rate = false
          } else {
            this.validate.rate = true
          }
          if (bill.quantity === '' || bill.quantity === null || bill.quantity === 0) {
            this.validate.quantity = false
          } else {
            this.validate.quantity = true
          }
          if (!this.validate.rate || !this.validate.quantity) {
            return false
          } else {
            return this.validateBill(bill)
          }
        }
        return this.validateBill(bill)
      } else if (bill.reason === this.reasons[1].name) {
        if (bill.paidAmount === '' || bill.paidAmount === null || bill.paidAmount === 0) {
          this.validate.paidAmount = false
        } else {
          this.validate.paidAmount = true
        }
        if (bill.mode === '' || bill.mode === null || bill.mode === '') {
          this.validate.mode = false
        } else {
          this.validate.mode = true
        }
        if (bill.paymentDate === 'undefined' || bill.paymentDate === null || bill.paymentDate === '') {
          this.validate.paymentDate = false
        } else {
          this.validate.paymentDate = true
        }
        if (bill.comment === '' || bill.comment === null || bill.comment === 0) {
          this.validate.comment = false
        } else {
          this.validate.comment = true
        }
        if (this.validate.paidAmount && this.validate.mode && this.validate.paymentDate && this.validate.comment) {
          if (this.supplierBillingSummary.totalDueAmount === 0.0) {
            this.validate.errorMessage = 'No Due amount is there for selected supplier and project.'
            return false
          } else if (bill.paidAmount > this.supplierBillingSummary.totalDueAmount) {
            this.validate.errorMessage = 'Payment amount can not be greater then due amount.'
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      } else if (bill.reason === this.reasons[2].name) {
        if (bill.paidAmount === '' || bill.paidAmount === null || bill.paidAmount === 0) {
          this.validate.paidAmount = false
        } else {
          this.validate.paidAmount = true
        }
        if (bill.mode === '' || bill.mode === null || bill.mode === '') {
          this.validate.mode = false
        } else {
          this.validate.mode = true
        }
        if (bill.paymentDate === 'undefined' || bill.paymentDate === null || bill.paymentDate === '') {
          this.validate.paymentDate = false
        } else {
          this.validate.paymentDate = true
        }
        if (bill.comment === '' || bill.comment === null || bill.comment === 0) {
          this.validate.comment = false
        } else {
          this.validate.comment = true
        }
        if (this.validate.paidAmount && this.validate.mode && this.validate.paymentDate && this.validate.comment) {
          if (this.supplierBillingSummary.totalDueAmount === 0) {
            return true
          } else if (this.supplierBillingSummary.totalDueAmount >= 0) {
            if (bill.paidAmount <= this.supplierBillingSummary.totalDueAmount) {
              this.validate.errorMessage = 'Advance amount can not be less or equal than due amount'
              return false
            } else {
              return true
            }
          }
        } else {
          return false
        }
      }
    },
    validateBill: function (bill) {
      if (bill.billingDate === 'undefined' || bill.billingDate === null || bill.billingDate === '') {
        this.validate.billingDate = false
      } else {
        this.validate.billingDate = true
      }
      if (bill.billAmount === '' || bill.billAmount === null || bill.billAmount === 0) {
        this.validate.billAmount = false
      } else {
        this.validate.billAmount = true
      }
      if (bill.paidAmount === '' || bill.paidAmount === null) {
        bill.paidAmount = 0
      } else {
        this.validate.paidAmount = true
      }
      if (bill.mode === '' || bill.mode === null || bill.mode === '') {
        if (this.validate.zeroPayment) {
          this.validate.mode = true
        } else {
          this.validate.mode = false
        }
      } else {
        this.validate.mode = true
      }
      if (bill.paymentDate === 'undefined' || bill.paymentDate === null || bill.paymentDate === '') {
        if (this.validate.zeroPayment) {
          this.validate.paymentDate = true
        } else {
          this.validate.paymentDate = false
        }
      } else {
        this.validate.paymentDate = true
      }
      if (bill.materials === undefined || bill.materials === null || bill.materials === '') {
        this.validate.material = false
      } else {
        this.validate.material = true
      }
      if (bill.comment === '' || bill.comment === null || bill.comment === 0) {
        this.validate.comment = false
      } else {
        this.validate.comment = true
      }
      if (this.validate.billingDate && this.validate.billAmount && this.validate.paidAmount && this.validate.mode && this.validate.paymentDate && this.validate.material && this.validate.comment) {
        if (bill.paidAmount > bill.billAmount) {
          this.validate.errorMessage = 'Payment amount can not be greater then bill amount.'
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    },
    print: function () {
      this.$htmlToPaper('printable')
    }
  },
  mounted () {
    this.clientId = this.$session.get('clientId')
    this.client = this.$session.get('clientName')
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
  border: 1px solid white;
  padding-right: 10px;
}
</style>
