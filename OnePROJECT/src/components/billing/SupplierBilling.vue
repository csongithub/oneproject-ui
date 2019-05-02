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
        <tr><td align="right"><h6>Billing Amount:</h6></td><td>{{' INR  '}}{{supplierBillingSummary.totalBillingAmount | numFormat('0.00')}}</td></tr>
        <tr><td align="right"><h6>Paid Amount:</h6></td><td>{{'  INR  '}}{{supplierBillingSummary.totalPaymentAmount | numFormat('0.00')}}</td></tr>
        <tr><td align="right"><h6>Due Amount:</h6></td><td>{{'  INR  '}}{{supplierBillingSummary.totalDueAmount | numFormat('0.00')}}</td></tr>
      </table>
      <p v-if="!selectedProject || !selectedSupplier" class="mt-5" style="margin-left: 30%; color: lightgray;">Please Select projetc and supplier</p>
    </b-card>
    </div>
    <div v-if="selectedProject && selectedSupplier" id="billing" style="display: none;" class="mt-0 ml-5 mr-5">
      <i class="fa fa-long-arrow-left fa-2x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="goToProject"></i>
      <i class="fa fa-print float-right fa-1x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="print">{{' ' + 'Print'}}</i>
      <div id="printable">
        <b-form>
          <b-card header="Payment" bg-variant="light">
            <b-row>
              <b-col>
                <label><b>Project:</b> {{selectedProject.projectName}}</label>
              </b-col>
              <b-col>
                <label><b>Supplier:</b> {{selectedSupplier.supplierName}}</label>
              </b-col>
              <b-col>
                <label><b>Owner:</b> {{selectedSupplier.owner}}</label>
              </b-col>
              <b-col>
                <label><b>Materials:</b> {{selectedSupplier.materials}}</label>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <label><b>Billing Amount:</b> {{'INR '}}{{supplierBillingSummary.totalBillingAmount | numFormat('0.00')}}</label>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Paid Amount:</b> {{'INR '}} {{ supplierBillingSummary.totalPaymentAmount | numFormat('0.00')}}</label>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Due Amount:</b>  {{'INR '}} {{supplierBillingSummary.totalDueAmount | numFormat('0.00')}}</label>
                </b-form-group>
              </b-col>
              <b-col>
              </b-col>
            </b-row>
            <div>
              <i id="paymentHistory" style="cursor: pointer; color: blue;" v-on:click="showPaymentHistory = !showPaymentHistory" :class="!showPaymentHistory ? 'fa fa-plus' : 'fa fa-minus'">{{showHideHistorytext}}</i>
              <div :style="showPaymentHistory ? 'display : block; border: 1px solid lightgreen;' : 'display : none;'">
                <b-table class="b-table" style="cursor: default" striped hover responsive :items="bills" :fields="billFields" :small="true" :fixed="true"></b-table>
                <!-- <br>
                <label><b>Total Salary Paid: </b>{{'INR '}}{{totalSalary | numFormat('0.00')}}</label><br>
                <label><b>Total Dues Salary: </b>{{'INR '}}{{totalDuesSalary | numFormat('0.00')}}</label><br>
                <label><b>Total Advance Paid: </b>{{'INR '}}{{totalAdvance | numFormat('0.00')}}</label><br>
                <label><b>Total Dues Paid: </b>{{'INR '}}{{totalDuesPaid | numFormat('0.00')}}</label><br>
                <label><b>Total Recovery Collected: </b>{{'INR '}}{{totalRecovery | numFormat('0.00')}}</label> -->
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
              <b-form-group :state="validate.billAmount" :invalid-feedback="'Enter ailling amount.'" class="b-form-group" id="billAmount" label="Enter Bill Amount(In INR):" label-for="billAmount" title="Represents total amount of bill.">
                <b-form-input :state="validate.billAmount" size="sm" class="b-form-input mt-2" id="billAmount" type="text" v-model="supplierBill.billAmount" required placeholder="Enter Bill Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount.'" class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.paidAmount" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="supplierBill.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" class = "b-form-select" v-model="supplierBill.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Select payment date.'" class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker class = "date-picker" v-model="supplierBill.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
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
                <b-form-input size="sm" class="b-form-input mt-2" id="billAmount" type="text" v-model="supplierBill.quantity" required placeholder="i.e 15KG or 50 Liters or 100 Bags "/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class="b-form-group" id="dueAmount" label="Due Amount(in INR):" label-for="dueAmount" title="Represents due bill amount.">
               <label>{{'INR '}}{{supplierBill.dueAmount |numFormat('0.00')}}</label>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea id="textarea" v-model="supplierBill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
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
              <b-form-group class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea id="textarea" v-model="supplierBill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class="b-form-group" id="dueAmount" label="Remainig Due Amount(in INR):" label-for="dueAmount" title="Represents due bill amount.">
               <label>{{'INR '}}{{supplierBillingSummary.totalDueAmount - supplierBill.paidAmount | numFormat('0.00')}}</label>
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
      allProjects: [],
      selectedProject: null,
      projectSuppliers: [],
      selectedSupplier: null,
      errMsg: null,
      reasons: [{'name': 'Bill Payment'}, {'name': 'Due Payment'}, {'name': 'Advance Payment'}],
      modes: [{'name': 'Cash'}, {'name': 'Card'}, {'name': 'Cheque'}, {'name': 'Account Transfer'}],
      supplierBill: this.getNewBill(),
      matterialArray: [],
      supplierBillingSummary: {'totalBillingAmount': 0.0, 'totalPaymentAmount': 0.0, 'totalDueAmount': 0.0},
      showPaymentHistory: false,
      showHideHistorytext: 'Payment History',
      billFields: {
        paymentDate: {
          label: 'Payment Date',
          sortable: true
        },
        reason: {
          label: 'Reason',
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
        quantity: {
          label: 'Quantity',
          sortable: false
        },
        comment: {
          label: 'Remark',
          sortable: false
        }
      },
      bills: [],
      validate: this.initiateValidateData()
    }
  },
  watch: {
    'supplierBill.paidAmount': function () {
      if (this.supplierBill.reason === this.reasons[0].name) {
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
        reason: null,
        billAmount: 0.0,
        paidAmount: 0.0,
        dueAmount: 0.0,
        paymentDate: null,
        materialsArray: [],
        materials: null,
        comment: null,
        mode: null,
        quantity: null
      }
    },
    initiateValidateData: function () {
      return {
        billAmount: true,
        paidAmount: true,
        mode: true,
        paymentDate: true,
        material: true,
        errorMessage: null
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
          let o = response.data
          self.bills = o
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
          // let o = response.data
          // this.bills = o
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
      if (bill.billAmount === '' || bill.billAmount === null || bill.billAmount === 0) {
        this.validate.billAmount = false
      } else {
        this.validate.billAmount = true
      }
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
      if (bill.materials === undefined || bill.materials === null || bill.materials === '') {
        this.validate.material = false
      } else {
        this.validate.material = true
      }
      if (bill.reason === this.reasons[0].name) {
        if (this.validate.billAmount && this.validate.paidAmount && this.validate.mode && this.validate.paymentDate && this.validate.material) {
          return true
        } else {
          return false
        }
      } else if (bill.reason === this.reasons[1].name) {
        if (this.validate.paidAmount && this.validate.mode && this.validate.paymentDate) {
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
      }
    },
    print: function () {
      this.$htmlToPaper('printable')
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
  border-radius: 4px;
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
