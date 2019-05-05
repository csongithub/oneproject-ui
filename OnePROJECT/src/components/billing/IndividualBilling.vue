<template>
  <div class="IndividualsBilling">
    <div class="mt-0 ml-5 mr-5" style="width:80%;" id="individuals">
      <result-table class="mt-1"  :expandable=true :expandableText="'Salary'" :expandableEntity="'Salary'" :actionable=true :enableAdd=false :enableDelete=false :enableRefresh=true :enableSearch=true
                                  :fields="fields" :data="individuals" :currentPage="currentPage" :perPage="perPage"
                                  @refresh="getSummarizedIndividualsForClient" @payment="goToPaymentPage"/>
    </div>
    <div class="mt-0 ml-5 mr-5" style="width:80%; display: none;" id="payment">
      <!-- <b-button class="b-button mb-0 ml-1" size="sm" variant="secondary" v-on:click="goBackToIndividuals()">Back</b-button> -->
      <i class="fa fa-long-arrow-left fa-2x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="goBackToIndividuals()"></i>
      <i class="fa fa-print float-right fa-1x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="print()">{{' ' + 'Print'}}</i>
      <div id="printable">
        <b-form>
          <b-card header="Payment" bg-variant="light">
            <b-row>
              <b-col>
                <label><b>Individual ID:</b> {{individual.individualId}}</label>
              </b-col>
              <b-col>
                <label><b>Name:</b> {{individual.fullName}}</label>
              </b-col>
              <b-col>
                <label><b>Position:</b> {{individual.position}}</label>
              </b-col>
              <b-col>
                <label><b>Joined On:</b> {{individual.joiningDate}}</label>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <label><b>Salary:</b> <i class="fa fa-inr"/>{{' '}}{{salary.salary}}{{' Per ' + salary.interval}}</label>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Effective From:</b> {{salary.effectiveFrom}}</label>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Status:</b> {{salary.status}}</label>
                </b-form-group>
              </b-col>
              <b-col>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <label><b>Income:</b> <i class="fa fa-inr"/>{{' '}}{{paymentSummary.totalPaymentAmount | numFormat('0.00')}}</label>
              </b-col>
              <b-col>
                <label><b>Paid:</b> <i class="fa fa-inr"/>{{' '}}{{paymentSummary.totalPaidAmount | numFormat('0.00')}}</label>
              </b-col>
              <b-col>
                  <label><b>Dues:</b> <i class="fa fa-inr"/>{{' '}}{{ paymentSummary.totalDueAmount | numFormat('0.00')}}</label>
              </b-col>
              <b-col>
                  <label><b>Advance:</b> <i class="fa fa-inr"/>{{' '}}{{paymentSummary.totalAdvanceAmount | numFormat('0.00')}}</label>
              </b-col>
              <b-col>
                  <label><b>Other Payment:</b> <i class="fa fa-inr"/>{{' '}}{{paymentSummary.totalOtherExpensePaid | numFormat('0.00')}}</label>
              </b-col>
            </b-row>
            <div>
              <i id="paymentHistory" style="cursor: pointer; color: blue;" v-on:click="showPaymentHistory = !showPaymentHistory" :class="!showPaymentHistory ? 'fa fa-plus' : 'fa fa-minus'">{{showHideHistorytext}}</i>
              <div :style="showPaymentHistory ? 'display : block; border: 1px solid lightgreen;' : 'display : none;'">
                <b-table class="b-table" style="cursor: default" striped hover responsive :items="payments" :fields="historyFields" :small="true" :fixed="true"></b-table>
              </div>
            </div>
          </b-card>
        </b-form>
      </div>
      <br>
      <b-form style="background-color: lightgreen; padding: 10px" title="Make Payment">
        <b-row>
          <b-col cols="auto">
            <b-form-group id="reason" label="Payment Reason:" label-for="reason" title="Represents payment reason.">
              <b-form-select class = "b-form-select" v-model="payment.reason" :options="reasons.map(a=>a.name)" size="sm">
                <option slot="first" :value="null">Choose</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <div v-if="payment.reason === reasons[0].name">
          <b-row>
            <b-col cols="auto">
              <b-form-group :state="validate.forMonth" :invalid-feedback="'Select month for payment.'" id="forMonth" label="Select Month:" label-for="forMonth" title="Represents payment's month.">
                <b-form-select :state="validate.forMonth" class = "b-form-select" v-model="payment.forMonth" :options="months.map(month=>month.name)" size="sm">
                  <option slot="first" :value="null">Choose Month</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group :state="validate.forYear" :invalid-feedback="'Select year for payment.'" id="forYear" label="Select year:" label-for="forYear" title="Represents payment's year.">
                <b-form-select :state="validate.forYear" class = "b-form-select" v-model="payment.forYear" :options="years.map(y=>y.year)" size="sm">
                  <option slot="first" :value="null">Choose Year</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group :state="validate.status" :invalid-feedback="'Select payment status.'" id="status" label="Select Payment Status:" label-for="status" title="Represents payment's status.">
                <b-form-select :state="validate.status" class = "b-form-select" v-model="payment.status" :options="status.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Select Status</option>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount.'"  class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.paidAmount"  :disabled="disabled" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="payment.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" :disabled="disabled"  class = "b-form-select" v-model="payment.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Select payment date.'"  class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker :disabled="disabled" class = "date-picker" v-model="payment.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.remark" :invalid-feedback="'Write some comment.'" class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.remark"  id="textarea" v-model="payment.remark" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class="b-form-group" id="dueAmount" label="Remainig Due Amount(in INR):" label-for="dueAmount" title="Represents due bill amount.">
               <label><i class="fa fa-inr"/>{{' '}}{{payment.dueAmount | numFormat('0.00')}}</label>
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
        <div v-if="payment.reason === reasons[1].name">
          <b-row>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount.'"  class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.paidAmount"  :disabled="disabled" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="payment.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" :disabled="disabled"  class = "b-form-select" v-model="payment.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Select payment date.'"  class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker :disabled="disabled" class = "date-picker" v-model="payment.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.remark" :invalid-feedback="'Write some comment.'" class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.remark"  id="textarea" v-model="payment.remark" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
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
        <div v-if="payment.reason === reasons[3].name">
          <b-row>
            <b-col>
              <b-form-group :state="validate.otherExpense" :invalid-feedback="'Enter payment amount.'"  class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.otherExpense"  :disabled="disabled" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="payment.otherExpense" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" :disabled="disabled"  class = "b-form-select" v-model="payment.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Select payment date.'"  class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker :disabled="disabled" class = "date-picker" v-model="payment.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.remark" :invalid-feedback="'Write some comment.'" class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.remark"  id="textarea" v-model="payment.remark" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
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
      <br>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../config.js'
import ResultTable from '../common/ResultTable'
import DatePicker from 'vue2-datepicker'
export default {
  name: 'IndividualsBilling',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  watch: {
    'payment.reason': function (value) {
      this.validate = this.initiateValidateData()
      if (value === this.reasons[0].name) {
        this.payment.salaryAmount = this.salary.salary
        this.payment.paidAmount = this.salary.salary
        this.payment.otherExpense = 0
      } else if (value === this.reasons[1].name) {
        this.payment.salaryAmount = 0
        this.payment.paidAmount = 0
        this.payment.dueAmount = 0
        this.payment.otherExpense = 0
      } else if (value === this.reasons[3].name) {
        this.payment.salaryAmount = 0
        this.payment.paidAmount = 0
        this.payment.otherExpense = 0
        this.payment.dueAmount = 0
      }
    },
    'payment.paidAmount': function (value) {
      if (this.payment.reason === this.reasons[0].name) {
        this.payment.dueAmount = this.salary.salary - value
      } else if (this.payment.reason === this.reasons[1].name) {
        this.payment.dueAmount = 0
      }
    },
    'payment.status': function (value) {
      if (value === this.status[1].name) {
        this.payment.paidAmount = 0
        this.disabled = true
      } else {
        this.payment.paidAmount = this.salary.salary
        this.disabled = false
      }
    }
  },
  data () {
    return {
      clientId: 0,
      baseAPI: config.SERVER_URL + 'IndividualPaymentEndPoint/',
      baseAPIForIndividual: config.SERVER_URL + 'IndividualEndPoint/',
      baseAPIForProject: config.SERVER_URL + 'ProjectEndPoint/',
      currentPage: 1,
      perPage: 10,
      individuals: [],
      fields: {
        expand: {
          key: 'expand',
          label: 'Expand'
        },
        individualId: {
          label: 'Individual ID',
          sortable: true
        },
        fullName: {
          label: 'Name',
          sortable: true
        },
        position: {
          label: 'Position',
          sortable: true
        },
        joiningDate: {
          label: 'Joined On',
          sortable: true
        }
      },
      individual: {},
      salary: {},
      allProjects: [],
      selectedProject: null,
      payment: this.getNewPymentObject(),
      paymentSummary: this.getNewPaymentSummary(),
      reasons: [
        {'name': 'Monthly Salary'}, {'name': 'Advance Payment'}, {'name': 'Dues Payment'}, {'name': 'Other'}
      ],
      modes: [{'name': 'Cash'}, {'name': 'Cheque'}, {'name': 'Account Transfer'}],
      months: [
        {'name': 'Jan'}, {'name': 'Feb'}, {'name': 'March'}, {'name': 'Apr'}, {'name': 'May'}, {'name': 'June'},
        {'name': 'July'}, {'name': 'Aug'}, {'name': 'Sep'}, {'name': 'oct'}, {'name': 'Nov'}, {'name': 'Dec'}
      ],
      status: [{'name': 'Paid'}, {'name': 'Pending'}],
      years: [{'year': 2018}, {'year': 2019}, {'year': 2020}],
      errorMessage: '',
      payments: [],
      historyFields: {
        paymentDate: {
          label: 'Payment Date',
          sortable: true
        },
        reason: {
          label: 'Reason',
          sortable: true
        },
        paymentFor: {
          label: 'Payment For',
          sortable: true
        },
        salaryAmount: {
          label: 'Salary Amount',
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
          label: 'Mode',
          sortable: true
        },
        status: {
          label: 'Salary Status',
          sortable: true
        },
        remark: {
          label: 'Remark',
          sortable: false
        }
      },
      validate: this.initiateValidateData(),
      disabled: false,
      showPaymentHistory: false,
      showHideHistorytext: 'Payment History'
    }
  },
  methods: {
    initiateValidateData: function () {
      return {
        errorMessage: null,
        paidAmount: true,
        otherExpense: true,
        mode: true,
        status: true,
        forMonth: true,
        forYear: true,
        paymentDate: true,
        remark: true
      }
    },
    getNewPymentObject: function () {
      return {
        individualId: null,
        reason: null,
        salaryAmount: 0.0,
        paidAmount: 0.0,
        dueAmount: 0.0,
        otherExpense: 0.0,
        mode: null,
        status: null,
        forMonth: null,
        forYear: null,
        paymentDate: null,
        remark: ''
      }
    },
    getNewPaymentSummary: function () {
      return {
        totalPaymentAmount: 0.0,
        totalPaidAmount: 0.0,
        totalDueAmount: 0.0,
        totalAdvanceAmount: 0.0
      }
    },
    getSummarizedIndividualsForClient: function () {
      let self = this
      axios.get(this.baseAPIForIndividual + 'getSummarizedIndividualsForClient' + '/' + this.clientId).then(response => {
        let o = response.data
        console.log(o)
        self.individuals = o
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    goToPaymentPage: function (obj) {
      console.log(obj)
      document.getElementById('individuals').style.display = 'none'
      document.getElementById('payment').style.display = 'block'
      this.individual = obj.individual
      this.salary = obj.salary
      this.payment = this.getNewPymentObject()
      this.getIndividualPaymentsSummary()
      this.getIndividualPayments()
      this.validate = this.initiateValidateData()
      this.disabled = false
      this.showPaymentHistory = false
    },
    goBackToIndividuals: function () {
      document.getElementById('individuals').style.display = 'block'
      document.getElementById('payment').style.display = 'none'
      // this.individual = {}
      // this.salary = {}
      // this.paymentSummary = this.getNewPaymentSummary()
      // this.payments = []
    },
    getSummarizedProjects: function () {
      let self = this
      axios.get(this.baseAPIForProject + 'getSummarizedProjects').then(response => {
        self.allProjects = response.data
        console.log(self.allProjects)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    makePayment: function () {
      let self = this
      let isValidPayment = this.validatePayment(this.payment)
      if (isValidPayment) {
        this.payment.individualId = this.individual.individualId
        axios.put(this.baseAPI + 'addPayment', this.payment).then(response => {
          let o = response.data
          console.log(o)
          this.getIndividualPaymentsSummary()
          this.getIndividualPayments()
          let reason = this.payment.reason
          this.payment = this.getNewPymentObject()
          this.payment.reason = reason
          self.$awn.success('Payment Done')
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }
    },
    getIndividualPaymentsSummary: function () {
      let self = this
      axios.get(this.baseAPI + 'getIndividualPaymentsSummary' + '/' + this.individual.individualId).then(response => {
        self.paymentSummary = response.data
        console.log(self.paymentSummary)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getIndividualPayments: function () {
      let self = this
      axios.get(this.baseAPI + 'getIndividualPayments' + '/' + this.individual.individualId).then(response => {
        self.payments = response.data
        self.$forceUpdate()
        console.log(self.payments)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    print: function () {
      this.$htmlToPaper('printable')
    },
    validatePayment: function (payment) {
      if (payment.reason === this.reasons[0].name) { // validating monthly salary payment
        if (payment.forMonth === null || payment.forMonth === undefined) {
          this.validate.forMonth = false
        } else {
          this.validate.forMonth = true
        }
        if (payment.forYear === null || payment.forYear === undefined) {
          this.validate.forYear = false
        } else {
          this.validate.forYear = true
        }
        if (payment.status === null || payment.status === undefined) {
          this.validate.status = false
        } else {
          this.validate.status = true
        }
        if (payment.remark === null || payment.remark === undefined || payment.remark === '') {
          this.validate.remark = false
        } else {
          this.validate.remark = true
        }
        if (payment.paidAmount === null || payment.paidAmount === undefined || payment.paidAmount === 0 || payment.paidAmount === '') {
          this.validate.paidAmount = false
        } else {
          this.validate.paidAmount = true
        }
        if (payment.mode === null || payment.mode === undefined || payment.mode === '') {
          this.validate.mode = false
        } else {
          this.validate.mode = true
        }
        if (payment.paymentDate === null || payment.paymentDate === undefined || payment.paymentDate === '') {
          this.validate.paymentDate = false
        } else {
          this.validate.paymentDate = true
        }
        if (this.validate.forMonth && this.validate.forYear && this.validate.status && this.validate.remark) {
          if (payment.status === this.status[0].name) {
            if (this.validate.paidAmount && this.validate.mode && this.validate.paymentDate) {
              return true
            } else {
              return false
            }
          } else if (payment.status === this.status[1].name) {
            return true
          }
        } else {
          if (payment.status === this.status[1].name) {
            this.validate.paidAmount = true
            this.validate.mode = true
            this.validate.paymentDate = true
          }
          return false
        }
      } else if (payment.reason === this.reasons[1].name || payment.reason === this.reasons[3].name) {
        if (payment.paidAmount === null || payment.paidAmount === undefined || payment.paidAmount === 0 || payment.paidAmount === '') {
          this.validate.paidAmount = false
        } else {
          this.validate.paidAmount = true
        }
        if (payment.otherExpense === null || payment.otherExpense === undefined || payment.otherExpense === 0 || payment.otherExpense === '') {
          this.validate.otherExpense = false
        } else {
          this.validate.otherExpense = true
        }
        if (payment.mode === null || payment.mode === undefined || payment.mode === '') {
          this.validate.mode = false
        } else {
          this.validate.mode = true
        }
        if (payment.paymentDate === null || payment.paymentDate === undefined || payment.paymentDate === '') {
          this.validate.paymentDate = false
        } else {
          this.validate.paymentDate = true
        }
        if (payment.remark === null || payment.remark === undefined || payment.remark === '') {
          this.validate.remark = false
        } else {
          this.validate.remark = true
        }
        if ((this.validate.paidAmount || this.validate.otherExpense) && this.validate.mode && this.validate.paymentDate && this.validate.remark) {
          if (this.validate.paidAmount) {
            if (payment.paidAmount <= this.paymentSummary.totalDueAmount) {
              this.validate.errorMessage = 'Advance amount can not be less than due amount.'
              return false
            } else {
              return true
            }
          } else if (this.validate.otherExpense) {
            return true
          }
        }
      }
    }
  },
  mounted () {
    this.clientId = this.$session.get('clientId')
    this.getSummarizedIndividualsForClient()
    this.getSummarizedProjects()
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
</style>
