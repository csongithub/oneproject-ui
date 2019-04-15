<template>
  <div class="IndividualsBilling">
    <div class="mt-0 ml-5 mr-5" style="width:80%;" id="individuals">
      <result-table class="mt-1"  :expandable=true :expandableText="'Salary'" :expandableEntity="'Salary'" :actionable=true :enableAdd=false :enableDelete=false :enableRefresh=true :enableSearch=true
                                  :fields="fields" :data="individuals" :currentPage="currentPage" :perPage="perPage"
                                  @refresh="getSummarizedIndividuals" @payment="goToPaymentPage"/>
    </div>
    <div class="mt-0 ml-5 mr-5" style="width:80%; display: none;" id="payment">
      <!-- <b-button class="b-button mb-0 ml-1" size="sm" variant="secondary" v-on:click="goBackToIndividuals()">Back</b-button> -->
      <i class="fa fa-long-arrow-left fa-2x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="goBackToIndividuals()"></i>
      <i class="fa fa-print float-right fa-1x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="print()">{{' ' + 'Print'}}</i>
      <div id="printable">
        <b-form>
          <b-card header="Payment" bg-variant="light" style="backgroud-color:lightgreen">
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
                <label><b>Salary:</b> {{'INR ' + salary.salary + ' Per ' + salary.interval}}</label>
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
                <label><b>Earnings:</b> {{'INR '}}{{earnings.totalEarnings | numFormat('0.00')}}</label>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Dues:</b> {{'INR '}} {{ earnings.totalDues | numFormat('0.00')}}</label>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Overpaid:</b>  {{'INR '}} {{earnings.overPaid | numFormat('0.00')}}</label>
                </b-form-group>
              </b-col>
              <b-col>
              </b-col>
            </b-row>
            <div>
              <i id="paymentHistory" style="cursor: pointer; color: blue;" v-on:click="showPaymentHistory = !showPaymentHistory" :class="!showPaymentHistory ? 'fa fa-plus' : 'fa fa-minus'">{{showHideHistorytext}}</i>
              <div :style="showPaymentHistory ? 'display : block; border: 1px solid lightgreen;' : 'display : none;'">
                <b-table class="b-table" style="cursor: default" striped hover responsive :items="payments" :fields="historyFields" :small="true" :fixed="true"></b-table>
                <br>
                <label><b>Total Salary Paid: </b>{{'INR '}}{{totalSalary | numFormat('0.00')}}</label><br>
                <label><b>Total Dues Salary: </b>{{'INR '}}{{totalDuesSalary | numFormat('0.00')}}</label><br>
                <label><b>Total Advance Paid: </b>{{'INR '}}{{totalAdvance | numFormat('0.00')}}</label><br>
                <label><b>Total Dues Paid: </b>{{'INR '}}{{totalDuesPaid | numFormat('0.00')}}</label><br>
                <label><b>Total Recovery Collected: </b>{{'INR '}}{{totalRecovery | numFormat('0.00')}}</label>
              </div>
            </div>
          </b-card>
        </b-form>
      </div>
      <br>
      <b-form style="background-color: lightgreen; padding: 10px" title="Make Payment">
        <b-row>
          <b-col><label style="color: red;">{{errorMessage}}</label></b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="reason" label="Payment Reason:" label-for="reason" title="Represents payment reason">
              <b-form-select class = "b-form-select" v-model="payment.reason" :options="reasons.map(a=>a.name)" size="sm">
                <option slot="first" :value="null">Choose</option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group v-if="showSalaryInput" class="b-form-group" id="salaryAmount" label="Enter Amount(In INR):" label-for="salaryAmount" title="Represents salary amount to be paid">
              <b-form-input size="sm" class="b-form-input mt-2" id="salaryAmount" type="text" v-model="payment.salaryAmount" required placeholder="Enter Amount"/>
            </b-form-group>
            <b-form-group v-else-if="showDuesInput" class="b-form-group" id="duesPayment" label="Enter Amount(In INR):" label-for="duesPayment" title="Represents dues payment amount to be paid">
              <b-form-input size="sm" class="b-form-input mt-2" id="duesPayment" type="text" v-model="payment.duesPayment" required placeholder="Enter Amount"/>
            </b-form-group>
            <b-form-group v-else-if="showAdvanceInput" class="b-form-group" id="advancePayment" label="Enter Amount(In INR):" label-for="advancePayment" title="Represents advance paymet amount to be paid">
              <b-form-input size="sm" class="b-form-input mt-2" id="advancePayment" type="text" v-model="payment.advancePayment" required placeholder="Enter Amount"/>
            </b-form-group>
            <b-form-group v-else-if="showRecoveryInput" class="b-form-group" id="recoveryAmount" label="Enter Amount(In INR):" label-for="advancePayment" title="Represents recovery amount to be paid">
              <b-form-input size="sm" class="b-form-input mt-2" id="recoveryAmount" type="text" v-model="payment.recoveryAmount" required placeholder="Enter Amount"/>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment">
              <b-form-select class = "b-form-select" v-model="payment.mode" :options="modes.map(a=>a.name)" size="sm">
                <option slot="first" :value="null">Choose</option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group class = "date-picker"  id="paymentFor" label="Payment For:" label-for="paymentFor" title="Represents date of payment">
              <date-picker class = "date-picker" v-model="payment.paymentFor" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Select project:">
              <b-form-select class = "b-form-select" v-model="selectedProject">
                <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project">{{project.projectName}}</option>
                <option slot="first" :value="null">Choose</option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group v-if="dueApplicable" class="b-form-group" id="dueSalaryAmount" label="Due Amount(in INR):" label-for="dueSalaryAmount" title="Represents due salary amount to be paid">
               <label>{{'INR ' + payment.dueSalaryAmount}}</label>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
             <b-form-group class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
               <b-form-textarea id="textarea" v-model="payment.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
            </b-form-group>
          </b-col>
           <b-col></b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-button style="box-shadow: 0px 0px 14px -2px rgba(0,0,0,0.75);" type="submit" class="b-button float-right" variant="success" v-on:click.prevent="makePayment()">Make Payment</b-button>
          </b-col>
        </b-row>
      </b-form>
      <br>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../main.js'
import ResultTable from '../common/ResultTable'
import DatePicker from 'vue2-datepicker'
export default {
  name: 'IndividualsBilling',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  watch: {
    'payment.reason': function (reason) {
      this.errorMessage = ''
      this.payment.salaryAmount = 0.0
      this.payment.dueSalaryAmount = 0.0
      this.payment.duesPayment = 0.0
      this.payment.advancePayment = 0.0
      this.payment.recoveryAmount = 0.0
      if (reason === this.reasons[0].name) {
        this.showSalaryInput = true
        this.showAdvanceInput = false
        this.showDuesInput = false
        this.payment.salaryAmount = this.salary.salary
        this.dueApplicable = true
        this.showRecoveryInput = false
      } else if (reason === this.reasons[1].name) {
        this.showSalaryInput = false
        this.showAdvanceInput = true
        this.showDuesInput = false
        this.dueApplicable = false
        this.showRecoveryInput = false
      } else if (reason === this.reasons[2].name) {
        this.showSalaryInput = false
        this.showAdvanceInput = false
        this.showDuesInput = true
        this.dueApplicable = false
        this.showRecoveryInput = false
        this.payment.duesPayment = this.earnings.totalDues
      } else if (reason === this.reasons[3].name) {
        this.showSalaryInput = false
        this.showAdvanceInput = false
        this.showDuesInput = false
        this.dueApplicable = false
        this.showRecoveryInput = true
        this.payment.recoveryAmount = this.earnings.overPaid
      }
    },
    'payment.salaryAmount': function (salaryAmount) {
      if (salaryAmount !== null && salaryAmount > 0) {
        this.payment.dueSalaryAmount = this.salary.salary - this.payment.salaryAmount
      }
    },
    showPaymentHistory: function () {
      if (this.showPaymentHistory) {
        this.showHideHistorytext = 'Hide Payment History'
        this.getIndividualPayments()
      } else {
        this.showHideHistorytext = 'Show Payment History'
      }
    }
  },
  data () {
    return {
      baseAPI: config.SERVER_URL + 'PaymentEndPoint/',
      baseAPIForIndividual: config.SERVER_URL + 'IndividualEndPoint/',
      baseAPIForProject: config.SERVER_URL + 'ProjectEndPoint/',
      currentPage: 1,
      perPage: 10,
      individuals: [],
      individual: {},
      salary: {},
      allProjects: [],
      selectedProject: null,
      dueApplicable: false,
      showSalaryInput: true,
      showDuesInput: false,
      showAdvanceInput: false,
      showRecoveryInput: false,
      earnings: {},
      payment: this.getNewPymentObject(),
      reasons: [
        {'name': 'Monthly Salary'}, {'name': 'Advance Payment'}, {'name': 'Dues Payment'}, {'name': 'Recovery'}
      ],
      modes: [
        {'name': 'Cash'}, {'name': 'Cheque'}, {'name': 'Account Transfer'}
      ],
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
      historyFields: {
        entryDate: {
          label: 'Entry Date',
          sortable: true
        },
        salaryAmount: {
          label: 'Salary',
          sortable: true
        },
        dueSalaryAmount: {
          label: 'Dues Salary',
          sortable: true
        },
        advancePayment: {
          label: 'Advance',
          sortable: true
        },
        duesPayment: {
          label: 'Dues Paid',
          sortable: true
        },
        recoveryAmount: {
          label: 'Recovery',
          sortable: true
        },
        mode: {
          label: 'Mode',
          sortable: true
        },
        comment: {
          label: 'Comment',
          sortable: true
        }
      },
      errorMessage: '',
      showPaymentHistory: false,
      showHideHistorytext: 'Show Payment History',
      payments: [],
      totalSalary: 0,
      totalDuesSalary: 0,
      totalAdvance: 0,
      totalDuesPaid: 0,
      totalRecovery: 0
    }
  },
  methods: {
    getNewPymentObject: function () {
      return {
        individualId: null,
        entity: null,
        salaryAmount: 0.0,
        dueSalaryAmount: 0.0,
        duesPayment: 0.0,
        advancePayment: 0.0,
        recoveryAmount: 0.0,
        paymentFor: null,
        reason: null,
        mode: null,
        comment: null,
        entryDate: null
      }
    },
    getSummarizedIndividuals: function () {
      let self = this
      axios.get(this.baseAPIForIndividual + 'getSummarizedIndividuals').then(response => {
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
      this.getIndividualEarnings()
    },
    goBackToIndividuals: function () {
      document.getElementById('individuals').style.display = 'block'
      document.getElementById('payment').style.display = 'none'
      this.individual = {}
      this.salary = {}
      this.payment = this.getNewPymentObject()
      this.earnings = {}
      this.payments = []
      this.showPaymentHistory = false
      this.totalSalary = 0
      this.totalDuesSalary = 0
      this.totalAdvance = 0
      this.totalDuesPaid = 0
      this.totalRecovery = 0
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
      let isValidPayment = this.validatePayment()
      if (isValidPayment) {
        this.payment.individualId = this.individual.individualId
        axios.put(this.baseAPI + 'addPayment', this.payment).then(response => {
          let o = response.data
          console.log(o)
          this.getIndividualEarnings()
          this.getIndividualPayments()
          this.payment = this.getNewPymentObject()
          self.$awn.success('Payment Done')
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }
    },
    getIndividualEarnings: function () {
      let self = this
      axios.get(this.baseAPI + 'getIndividualEarnings' + '/' + this.individual.individualId).then(response => {
        self.earnings = response.data
        console.log(self.earnings)
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
        for (let payment of self.payments) {
          self.totalSalary = self.totalSalary + payment.salaryAmount
          self.totalDuesSalary = self.totalDuesSalary + payment.dueSalaryAmount
          self.totalAdvance = self.totalAdvance + payment.advancePayment
          self.totalDuesPaid = self.totalDuesPaid + payment.duesPayment
          self.totalRecovery = self.totalRecovery + payment.recoveryAmount
        }
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    validatePayment: function () {
      // validate advance payment
      if (this.payment.reason === this.reasons[1].name) {
        if (this.payment.advancePayment <= this.earnings.totalDues) {
          this.errorMessage = 'This payment can not be an Advance Payment, please change the reason to Dues Payment'
          return false
        } else {
          this.errorMessage = ''
          return true
        }
      } else if (this.payment.reason === this.reasons[2].name) {
        if (this.earnings.totalDues !== null && this.earnings.totalDues !== undefined && this.earnings.totalDues > 0) {
          if (this.payment.duesPayment <= this.earnings.totalDues) {
            this.errorMessage = ''
            return true
          } else {
            this.errorMessage = 'This payment can not be a Dues Payment, please change the reason to Advance or Monthly Salary'
            return false
          }
        } else {
          this.errorMessage = 'This payment can not be a Dues Payment, please change the reason to Advance or Monthly Salary'
          return false
        }
      } else if (this.payment.reason === this.reasons[3].name) {
        if (this.earnings.totalDues > 0) {
          this.errorMessage = 'This payment can not be a Recovery Payment, please change the reason to Advance or Dues Payment'
          return false
        } else if (this.earnings.overPaid === null || this.earnings.overPaid === undefined || this.earnings.overPaid <= 0 || (this.earnings.overPaid < this.payment.recoveryAmount)) {
          this.errorMessage = 'This payment can not be a Recovery Payment, please change the reason to Advance or Monthly Salary'
          return false
        } else {
          return true
        }
      }
      return true
    },
    print: function () {
      this.$htmlToPaper('printable')
    }
  },
  mounted () {
    this.getSummarizedIndividuals()
    this.getSummarizedProjects()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
