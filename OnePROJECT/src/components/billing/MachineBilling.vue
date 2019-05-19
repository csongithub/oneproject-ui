<template>
  <div class="MachineBilling">
    <div id = "machines">
      <div class="mt-0 ml-5 mr-5">
        <b-form-group label-cols-sm="1" label="Select project: ">
          <b-input-group-append class="ml-4">
            <b-form-select class = "b-form-select" v-model="selectedProject"  @change="getProjectMachines" size="sm" style="width: 39%;">
              <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project">{{project.projectName}}</option>
              <option slot="first" :value="null">Please Select a Project</option>
            </b-form-select>
          </b-input-group-append>
        </b-form-group>
      </div>
      <div style="overflow: hidden; width: 95%; margin:auto;">
        <b-card class="float-left mr-2 mb-5" v-for="machine in projectMachines" v-bind:key="machine.machineId" style="height: 100%; width:30%">
          <h6 slot="header" class="mb-0">{{machine.machineType}}
            <img class="float-right" v-if="machine.machineType==='JCB'" :src="require('../../assets/machine_icons/jcb.png')" style="height: 25px; width: 25px;"/>
            <img class="float-right" v-if="machine.machineType==='Roller'" :src="require('../../assets/machine_icons/roller.png')" style="height: 25px; width: 25px;"/>
            <img class="float-right" v-if="machine.machineType==='Water Tanker'" :src="require('../../assets/machine_icons/hiva.png')" style="height: 25px; width: 25px;"/>
            <img class="float-right" v-if="machine.machineType==='Tractor'" :src="require('../../assets/machine_icons/tractor.jpg')" style="height: 25px; width: 25px;"/>
            <img class="float-right" v-if="machine.machineType==='Soil Compactor'" :src="require('../../assets/machine_icons/hiva.png')" style="height: 25px; width: 25px;"/>
            <img class="float-right" v-if="machine.machineType==='Mixer Machin'" :src="require('../../assets/machine_icons/hiva.png')" style="height: 25px; width: 25px;"/>
            <img class="float-right" v-if="machine.machineType==='Mini Truck'" :src="require('../../assets/machine_icons/hiva.png')" style="height: 25px; width: 25px;"/>
            <img class="float-right" v-if="machine.machineType==='Truck'" :src="require('../../assets/machine_icons/hiva.png')" style="height: 25px; width: 25px;"/>
            <img class="float-right" v-if="machine.machineType==='Hiva'" :src="require('../../assets/machine_icons/hiva.png')" style="height: 25px; width: 25px;"/>
          </h6>
          <b-row>
            <b-col><label>Machine Name</label></b-col>
            <b-col>{{machine.machineName}}</b-col>
          </b-row>
          <b-row>
            <b-col><label>Machine Number</label></b-col>
            <b-col>{{machine.machineNumber}}</b-col>
          </b-row>
          <b-row>
            <b-col><label>Running Cost</label></b-col>
            <b-col><label>{{machine.charge}}</label></b-col>
          </b-row>
          <b-row>
            <b-col><label>Pricing Unit</label></b-col>
            <b-col>{{machine.pricingUnit}}</b-col>
          </b-row>
          <b-row>
            <b-col><label>Owner</label></b-col>
            <b-col>{{machine.owner}}</b-col>
          </b-row>
          <br>
          <b-row>
            <b-col>
              <span class="button float-right" v-on:click="goToBilling(machine)">Go To Billing<i class="fa fa-cog fa-spin float-right"/></span>
            </b-col>
          </b-row>
        </b-card>
      </div>
    </div>
    <div v-if="selectedProject && machine" id="billing" class="mt-0 ml-5 mr-5" style="display: none;">
      <i class="fa fa-long-arrow-left fa-2x" style="cursor: pointer; color:gray; padding:5px;" v-on:click="goToMachines"></i>
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
                <label><b>Machine Owner:</b> {{machine.owner}}</label>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <label><b>Machine:</b> {{machine.machineName}}</label>
              </b-col>
              <b-col>
                <label><b>Number:</b> {{machine.machineNumber}}</label>
              </b-col>
              <b-col>
                <label><b>Category:</b> {{machine.machineType}}</label>
              </b-col>
              <b-col>
                <label><b>Pricing:</b> {{machine.charge}}</label>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <label><b>Billing Amount:</b><i class="fa fa-inr"/>{{' '}}{{machineBillingSummary.totalBillingAmount}}</label>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Paid Amount:</b><i class="fa fa-inr"/>{{' '}}{{ machineBillingSummary.totalPaidAmount}}</label>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Due Amount:</b><i class="fa fa-inr"/>{{' '}}{{machineBillingSummary.totalDueAmount}}</label>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label><b>Advance Amount:</b><i class="fa fa-inr"/>{{' '}}{{machineBillingSummary.totalAdvanceAmount}}</label>
                </b-form-group>
              </b-col>
            </b-row>
            <div>
              <i id="paymentHistory" style="cursor: pointer; color: blue;" v-on:click="showPaymentHistory = !showPaymentHistory" :class="!showPaymentHistory ? 'fa fa-plus' : 'fa fa-minus'">{{showHideHistorytext}}</i>
              <div :style="showPaymentHistory ? 'display : block; border: 1px solid lightgreen;' : 'display : none;'">
                <label style="color: blue; font-size: 30; font-weight: bold;">Billing History</label>
                <b-table class="b-table" style="cursor: default" striped hover responsive :items="bills" :fields="machine.pricingUnit === 'Hour' ? hoursBillingfields : monthlyBillingfields" :small="true" :fixed="true"></b-table>
                <hr>
                <label style="color: blue; font-size: 30; font-weight: bold;">Payment History</label>
                <b-table class="b-table" style="cursor: default" striped hover responsive :items="payments" :fields="paymentFields" :small="true" :fixed="true"></b-table>
              </div>
            </div>
          </b-card>
        </b-form>
      </div>
      <br>
      <b-form title="Do machine payment here" style="background-color: lightgreen; padding: 10px">
        <b-row>
          <b-col cols="auto">
            <b-form-group id="reason" label="Payment Reason:" label-for="reason" title="Represents payment reason.">
              <b-form-select class = "b-form-select" v-model="bill.reason" :options="reasons.map(a=>a.name)" size="sm">
                <option slot="first" :value="null">Choose</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <div v-if="bill.reason === reasons[0].name">
          <b-row>
            <b-col cols="auto">
              <b-form-group :state="validate.billingDate" :invalid-feedback="'Select billing date.'"   class = "date-picker"  id="paymentDate" label="Billing Date:" label-for="billingDate" title="Represents date of billing.">
                <date-picker class = "date-picker" v-model="bill.billingDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col cols="auto" v-if="machine.pricingUnit==='Hour'">
              <b-form-group class="b-form-group" id="runningHour" label="Running Hour(s):" label-for="runningHour" title="Represents running hours of machine.">
                <b-form-select class = "b-form-select" v-model="bill.runningHours" :options="hours.map(a=>a.hour)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="auto" v-if="machine.pricingUnit==='Hour'">
              <b-form-group class="b-form-group" id="runningMinutes" label="Running Minute(s):" label-for="runningMinutes" title="Represents running minutes of machine.">
                <b-form-select class = "b-form-select" v-model="bill.runningMinutes" :options="minutes.map(a=>a.minute)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="auto" v-if="machine.pricingUnit==='Month'">
              <b-form-group :state="validate.forMonth" :invalid-feedback="'Select month for payment.'" id="forMonth" label="Select Month:" label-for="forMonth" title="Represents payment's month.">
                <b-form-select :state="validate.forMonth" class = "b-form-select" v-model="bill.forMonth" :options="months.map(month=>month.name)" size="sm">
                  <option slot="first" :value="null">Choose Month</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="auto" v-if="machine.pricingUnit==='Month'">
              <b-form-group :state="validate.forYear" :invalid-feedback="'Select year for payment.'" id="forYear" label="Select year:" label-for="forYear" title="Represents payment's year.">
                <b-form-select :state="validate.forYear" class = "b-form-select" v-model="bill.forYear" :options="years.map(y=>y.year)" size="sm">
                  <option slot="first" :value="null">Choose Year</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group v-if="machine.pricingUnit==='Hour'" class="b-form-group" label="Generate Bill:" title="Generate Bill">
                  <span class ="button" v-on:click="generateBillByPeriod">Generate</span>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="auto">
              <b-form-group :state="validate.billingAmount" :invalid-feedback="'Please generate bill.'" class="b-form-group" id="billingAmount" label="Billing Amount (In INR):" label-for="billingAmount" title="Represents billing amount.">
                <label v-if="machine.pricingUnit==='Hour'"><i class="fa fa-inr"/>{{' '}}{{bill.billingAmount | numFormat('0.00')}}</label>
                <label v-else-if="machine.pricingUnit==='Month'"><i class="fa fa-inr"/>{{' '}}{{machine.price | numFormat('0.00')}}</label>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group class="b-form-group" id="paidAmount" label="Payment Amount (In INR):" label-for="paidAmount" title="Represents actual payment amount">
                <b-form-input size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="bill.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-form-group :state="validate.mode" :invalid-feedback="'Select paymemt mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" :disabled="disable.mode" class = "b-form-select" v-model="bill.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Select paymemt date.'" class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker :disabled="disable.paymentDate"  class = "date-picker" v-model="bill.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col/>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.comment" :invalid-feedback="'Write some comment.'" class="b-form-group" id="remark" label="Remark:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.comment" id="textarea" v-model="bill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class="b-form-group" id="dueAmount" label="Due Amount(in INR):" label-for="dueAmount" title="Represents due bill amount.">
               <label><i class="fa fa-inr"/>{{' '}}{{bill.dueAmount |numFormat('0.00')}}</label>
              </b-form-group>
            </b-col>
            <b-col/>
          </b-row>
          <b-row>
            <b-col>
              <label class="float-left" v-if="validate.errorMessage" style="color: red;">{{validate.errorMessage}}</label>
              <span class="button float-right" v-on:click="makePayment">Make Payment</span>
            </b-col>
          </b-row>
        </div>
        <div v-if="bill.reason === reasons[1].name">
          <b-row>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount'" class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.paidAmount" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="bill.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Please select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" class = "b-form-select" v-model="bill.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Please select payment date.'" class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker class = "date-picker" v-model="bill.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.comment" invalid-feedback="Write some comment." class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.comment" id="textarea" v-model="bill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class="b-form-group" id="dueAmount" label="Remainig Due Amount(in INR):" label-for="dueAmount" title="Represents due bill amount.">
               <label><i class="fa fa-inr"/>{{' '}}{{machineBillingSummary.totalDueAmount - bill.paidAmount | numFormat('0.00')}}</label>
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
        <div v-if="bill.reason === reasons[2].name">
          <b-row>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount'" class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.paidAmount" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="bill.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Please select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" class = "b-form-select" v-model="bill.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Please select payment date.'" class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker class = "date-picker" v-model="bill.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.comment" invalid-feedback="Write some comment." class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.comment" id="textarea" v-model="bill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col></b-col>
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
        <div v-if="bill.reason === reasons[3].name">
          <b-row>
            <b-col>
              <b-form-group :state="validate.paidAmount" :invalid-feedback="'Enter payment amount'" class="b-form-group" id="paidAmount" label="Enter Payment Amount(In INR):" label-for="paidAmount" title="Represents actual amount to be paid.">
                <b-form-input :state="validate.paidAmount" size="sm" class="b-form-input mt-2" id="paidAmount" type="text" v-model="bill.paidAmount" required placeholder="Enter Payment Amount"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.mode" :invalid-feedback="'Please select payment mode.'" id="mode" label="Payment Mode:" label-for="mode" title="Represents mode of payment.">
                <b-form-select :state="validate.mode" class = "b-form-select" v-model="bill.mode" :options="modes.map(a=>a.name)" size="sm">
                  <option slot="first" :value="null">Choose</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :state="validate.paymentDate" :invalid-feedback="'Please select payment date.'" class = "date-picker"  id="paymentDate" label="Payment Date:" label-for="paymentDate" title="Represents date of payment.">
                <date-picker class = "date-picker" v-model="bill.paymentDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <b-col></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :state="validate.comment" invalid-feedback="Write some comment." class="b-form-group" id="remark" label="Comment:" label-for="remark" title="Represents remark for payment">
                <b-form-textarea :state="validate.comment" id="textarea" v-model="bill.comment" placeholder="Your comments here..." rows="2" max-rows="3"></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col></b-col>
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
  name: 'MachineBilling',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  watch: {
    'bill.reason': function (value) {
      this.bill = this.getNewBill()
      this.bill.reason = value
      this.validate = this.getNewValidate()
    },
    'bill.billingAmount': function (value) {
      if (this.bill.reason === this.reasons[0].name) {
        this.bill.dueAmount = this.bill.billingAmount - this.bill.paidAmount
      }
    },
    'bill.paidAmount': function (value) {
      if (this.bill.reason === this.reasons[0].name) {
        if (value > 0) {
          this.bill.dueAmount = this.bill.billingAmount - this.bill.paidAmount
          this.disable.mode = false
          this.disable.paymentDate = false
          this.validate.zeroPayment = false
        } else {
          this.disable.mode = true
          this.disable.paymentDate = true
          this.validate.zeroPayment = true
        }
      }
    }
  },
  data () {
    return {
      clientId: 0,
      client: null,
      projectAPI: config.SERVER_URL + 'ProjectEndPoint/',
      machineAPI: config.SERVER_URL + 'MachineEndPoint/',
      machineBillAPI: config.SERVER_URL + 'MachineBillEndPoint/',
      allProjects: [],
      selectedProject: null,
      projectMachines: [],
      machine: {},
      bill: this.getNewBill(),
      reasons: [{'name': 'New Bill'}, {'name': 'Due Payment'}, {'name': 'Advance Payment'}, {'name': 'Other Expense'}],
      modes: [{'name': 'Cash'}, {'name': 'Card'}, {'name': 'Cheque'}, {'name': 'Account Transfer'}],
      months: [
        {'name': 'Jan'}, {'name': 'Feb'}, {'name': 'March'}, {'name': 'Apr'}, {'name': 'May'}, {'name': 'June'},
        {'name': 'July'}, {'name': 'Aug'}, {'name': 'Sep'}, {'name': 'oct'}, {'name': 'Nov'}, {'name': 'Dec'}
      ],
      years: [{'year': 2018}, {'year': 2019}, {'year': 2020}],
      hours: this.getHours(),
      minutes: this.getMinutes(),
      disable: this.getNewDisable(),
      validate: this.getNewValidate(),
      machineBillingSummary: {},
      showPaymentHistory: false,
      showHideHistorytext: 'Payment History',
      bills: [],
      payments: [],
      hoursBillingfields: {
        billingDate: {
          label: 'Billing Date',
          sortable: true
        },
        paymentDate: {
          label: 'Payment Date',
          sortable: true
        },
        billingAmount: {
          label: 'Billing Amount',
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
        runningPeriod: {
          label: 'Running Hours',
          sortable: true
        },
        comment: {
          label: 'Remark',
          sortable: false
        }
      },
      monthlyBillingfields: {
        billingDate: {
          label: 'Billing Date',
          sortable: true
        },
        paymentDate: {
          label: 'Payment Date',
          sortable: true
        },
        billingAmount: {
          label: 'Billing Amount',
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
        paymentFor: {
          label: 'Payment For',
          sortable: true
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
          label: 'Payment Amount',
          sortable: true
        },
        mode: {
          label: 'Payment Mode',
          sortable: true
        },
        comment: {
          label: 'Remark',
          sortable: false
        }
      }
    }
  },
  methods: {
    getNewBill: function () {
      return {
        reason: 'New Bill',
        machineId: null,
        projectId: null,
        billingDate: null,
        paymentDate: null,
        runningHours: 0,
        runningMinutes: 0,
        runningPeriod: null,
        forMonth: null,
        forYear: null,
        paymentFor: null,
        billingAmount: 0.0,
        paidAmount: 0.0,
        dueAmount: 0.0,
        mode: null,
        comment: null
      }
    },
    getNewPriginWrapper: function () {
      return {
        linkageId: 0,
        billAmount: 0,
        hours: 0,
        minutes: 0,
        months: 0,
        days: 0
      }
    },
    getHours: function () {
      let hours = []
      for (let i = 0; i < 16; i++) {
        hours.push({'hour': i})
      }
      return hours
    },
    getMinutes: function () {
      let minutes = []
      for (let i = 0; i < 60; i++) {
        minutes.push({'minute': i})
      }
      return minutes
    },
    getNewDisable: function () {
      return {
        paymentDate: true,
        mode: true
      }
    },
    getNewValidate: function () {
      return {
        zeroPayment: true,
        errorMessage: null,
        billingDate: true,
        billingAmount: true,
        mode: true,
        paymentDate: true,
        comment: true,
        runningPeriod: true,
        forMonth: true,
        forYear: true
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
    getProjectMachines: function () {
      let self = this
      axios.get(this.projectAPI + 'getProjectMachines' + '/' + this.selectedProject.projectId).then(response => {
        self.projectMachines = response.data
        console.log(self.projectMachines)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    goToBilling: function (machine) {
      this.machine = machine
      this.validate = this.getNewValidate()
      this.bill = this.getNewBill()
      if (this.machine.pricingUnit === 'Month') {
        this.bill.billingAmount = this.machine.price
      }
      this.$forceUpdate()
      this.showPaymentHistory = false
      document.getElementById('machines').style.display = 'none'
      document.getElementById('billing').style.display = 'block'
      console.log(this.machine)
      this.getMachineBillsForProject()
      this.getMachineBillingSummaryForProject()
    },
    goToMachines: function () {
      this.machine = {}
      this.bill = this.getNewBill()
      document.getElementById('billing').style.display = 'none'
      document.getElementById('machines').style.display = 'block'
    },
    generateBillByPeriod: function () {
      let self = this
      console.log(this.machine)
      let wrapper = this.getNewPriginWrapper()
      Vue.set(wrapper, 'linkageId', this.machine.linkageId)
      Vue.set(wrapper, 'hours', this.bill.runningHours)
      Vue.set(wrapper, 'minutes', this.bill.runningMinutes)
      console.log('Pricing Wrapper: ' + wrapper)
      axios.post(this.machineBillAPI + 'generateBillByPeriod', wrapper).then(response => {
        let o = response.data
        console.log('Bill Amount: ' + o.billAmount)
        self.bill.billingAmount = o.billAmount
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    makePayment: function () {
      let self = this
      let valid = this.validatePayment(this.bill)
      if (valid) {
        Vue.set(this.bill, 'machineId', this.machine.machineId)
        Vue.set(this.bill, 'projectId', this.selectedProject.projectId)
        if (this.machine.pricingUnit === 'Hour') {
          Vue.set(this.bill, 'runningPeriod', this.bill.runningHours + ':' + this.bill.runningMinutes)
        } else if (this.machine.pricingUnit === 'Month') {
          Vue.set(this.bill, 'paymentFor', this.bill.forMonth + '-' + this.bill.forYear)
        }
        axios.post(this.machineBillAPI + 'addBill', this.bill).then(response => {
          let o = response.data
          console.log(o)
          self.bill = self.getNewBill()
          self.validate = self.getNewValidate()
          self.$awn.success('Payment Done.')
          this.getMachineBillsForProject()
          this.getMachineBillingSummaryForProject()
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }
    },
    getMachineBillsForProject: function () {
      let self = this
      axios.get(this.machineBillAPI + 'getMachineBillsForProject' + '/' + this.machine.machineId + '/' + this.selectedProject.projectId).then(response => {
        let all = response.data
        self.bills.splice(0, self.bills.length)
        self.payments.splice(0, self.payments.length)
        for (let o of all) {
          if (o.reason === self.reasons[0].name) {
            self.bills.push(o)
          } else {
            self.payments.push(o)
          }
        }
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getMachineBillingSummaryForProject: function () {
      let self = this
      axios.get(this.machineBillAPI + 'getMachineBillingSummaryForProject' + '/' + this.machine.machineId + '/' + this.selectedProject.projectId).then(response => {
        self.machineBillingSummary = response.data
        console.log('Machine Billing Summary: ', self.machineBillingSummary)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    validatePayment: function (bill) {
      if (bill.reason === this.reasons[0].name) {
        if (bill.billingDate === 'undefined' || bill.billingDate === null || bill.billingDate === '') {
          this.validate.billingDate = false
        } else {
          this.validate.billingDate = true
        }
        this.$forceUpdate()
        if (bill.billingAmount === 'undefined' || bill.billingAmount === null || bill.billingAmount === 0) {
          this.validate.billingAmount = false
          this.validate.errorMessage = 'Please generate bill.'
        } else {
          this.validate.billingAmount = true
        }
        this.validateRunningPeriod(bill)
        this.$forceUpdate()
        if (bill.mode === 'undefined' || bill.mode === null || bill.mode === '') {
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
        if (bill.comment === 'undefined' || bill.comment === null || bill.comment === '') {
          this.validate.comment = false
        } else {
          this.validate.comment = true
        }
        if (this.validate.billingDate && this.validate.billingAmount && this.validate.mode && this.validate.paymentDate && this.validate.comment) {
          if (this.machine.pricingUnit === 'Hour' && this.validate.runningPeriod) {
            return true
          } else if (this.machine.pricingUnit === 'Month' && this.validate.forMonth && this.validate.forYear) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else if (bill.reason === this.reasons[1].name) {
        if (bill.paidAmount === 'undefined' || bill.paidAmount === null || bill.paidAmount === 0 || bill.paidAmount === '') {
          this.validate.paidAmount = false
        } else {
          this.validate.paidAmount = true
        }
        if (bill.mode === 'undefined' || bill.mode === null || bill.mode === '') {
          this.validate.mode = false
        } else {
          this.validate.mode = true
        }
        if (bill.paymentDate === 'undefined' || bill.paymentDate === null || bill.paymentDate === '') {
          this.validate.paymentDate = false
        } else {
          this.validate.paymentDate = true
        }
        if (bill.comment === 'undefined' || bill.comment === null || bill.comment === '') {
          this.validate.comment = false
        } else {
          this.validate.comment = true
        }
        this.$forceUpdate()
        if (this.validate.paidAmount && this.validate.mode && this.validate.paymentDate && this.validate.comment) {
          if (this.machineBillingSummary.totalDueAmount === 0.0) {
            this.validate.errorMessage = 'No Due amount is there for selected machine.'
            return false
          } else if (bill.paidAmount > this.machineBillingSummary.totalDueAmount) {
            this.validate.errorMessage = 'Payment amount can not be grater than total due amount.'
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      } else if (bill.reason === this.reasons[2].name) {
        if (bill.paidAmount === 'undefined' || bill.paidAmount === null || bill.paidAmount === 0 || bill.paidAmount === '') {
          this.validate.paidAmount = false
        } else {
          this.validate.paidAmount = true
        }
        if (bill.mode === 'undefined' || bill.mode === null || bill.mode === '') {
          this.validate.mode = false
        } else {
          this.validate.mode = true
        }
        if (bill.paymentDate === 'undefined' || bill.paymentDate === null || bill.paymentDate === '') {
          this.validate.paymentDate = false
        } else {
          this.validate.paymentDate = true
        }
        if (bill.comment === 'undefined' || bill.comment === null || bill.comment === '') {
          this.validate.comment = false
        } else {
          this.validate.comment = true
        }
        this.$forceUpdate()
        if (this.validate.paidAmount && this.validate.mode && this.validate.paymentDate && this.validate.comment) {
          if (bill.paidAmount <= this.machineBillingSummary.totalDueAmount) {
            this.validate.errorMessage = 'Payment amount can not be grater than total due amount.'
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      } else if (bill.reason === this.reasons[3].name) {
        if (bill.paidAmount === 'undefined' || bill.paidAmount === null || bill.paidAmount === 0 || bill.paidAmount === '') {
          this.validate.paidAmount = false
        } else {
          this.validate.paidAmount = true
        }
        if (bill.mode === 'undefined' || bill.mode === null || bill.mode === '') {
          this.validate.mode = false
        } else {
          this.validate.mode = true
        }
        if (bill.paymentDate === 'undefined' || bill.paymentDate === null || bill.paymentDate === '') {
          this.validate.paymentDate = false
        } else {
          this.validate.paymentDate = true
        }
        if (bill.comment === 'undefined' || bill.comment === null || bill.comment === '') {
          this.validate.comment = false
        } else {
          this.validate.comment = true
        }
        this.$forceUpdate()
        if (this.validate.paidAmount && this.validate.mode && this.validate.paymentDate && this.validate.comment) {
          return true
        } else {
          return false
        }
      }
    },
    validateRunningPeriod: function (bill) {
      if (this.machine.pricingUnit === 'Hour') {
        let hour
        let minute
        if (bill.runningHours === 'undefined' || bill.runningHours === null || bill.runningHours === 0) {
          hour = false
        } else {
          hour = true
        }
        if (bill.runningMinutes === 'undefined' || bill.runningMinutes === null || bill.runningMinutes === 0) {
          minute = false
        } else {
          minute = true
        }
        if (hour || minute) {
          this.validate.runningPeriod = true
          this.validate.errorMessage = ''
        } else {
          this.validate.runningPeriod = false
          this.validate.errorMessage = 'Please select running hours/minutes.'
        }
      } else if (this.machine.pricingUnit === 'Month') {
        if (bill.forMonth === null || bill.forMonth === undefined) {
          this.validate.forMonth = false
        } else {
          this.validate.forMonth = true
        }
        if (bill.forYear === null || bill.forYear === undefined) {
          this.validate.forYear = false
        } else {
          this.validate.forYear = true
        }
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
  color: white;
  cursor: pointer;
  background-color: green;
  padding-left: 3px;
  padding-right: 3px;
  padding-bottom: 2px;
}

.button:hover{
  background-color:mediumseagreen;
  color: black;
}
</style>
