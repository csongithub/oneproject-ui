<template>
  <div class="supplierbilling">
    <div id="project">
    <b-card class="mt-0 ml-5 mr-5 float-left" style="height: 30vh; width: 40%;">
      <b-form-group label="Select project: ">
          <b-form-select class = "b-form-select" v-model="selectedProject"  @change="getProjectSuppliers" size="sm">
            <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project">{{project.projectName}}</option>
            <option slot="first" :value="null">Please Select a Project</option>
          </b-form-select>
      </b-form-group>
      <b-form-group label-cols-sm="auto" label="Select Supplier: ">
          <b-form-select class = "b-form-select" v-model="selectedSupplier" size="sm">
            <option v-for="supplier in projectSuppliers" v-bind:key="supplier.id" :value="supplier">{{supplier.supplierName}}</option>
            <option slot="first" :value="null">Please Select a Project</option>
          </b-form-select>
      </b-form-group>
      <label v-if="errMsg" style="color: red;">{{errMsg}}</label>
      <span class="button float-right" v-on:click="goToBilling">Go To Billing</span>
    </b-card>
    <b-card  style="height: 30vh; width: 30%;" header="Billing Summary">
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
                <label><b>Supplier Owner:</b> {{selectedSupplier.owner}}</label>
              </b-col>
              <b-col>
                <label><b>Materials:</b> {{selectedSupplier.materials}}</label>
              </b-col>
            </b-row>
            <!-- <div>
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
            </div> -->
          </b-card>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
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
      clientId: 0,
      allProjects: [],
      selectedProject: null,
      projectSuppliers: [],
      selectedSupplier: null,
      errMsg: null
    }
  },
  watch: {
    selectedProject: function () {
      if (this.selectedProject === null) {
        this.projectSuppliers = []
      }
    }
  },
  methods: {
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
    },
    goToBilling: function () {
      if (this.selectedProject && this.selectedSupplier) {
        this.errMsg = null
        document.getElementById('project').style.display = 'none'
        document.getElementById('billing').style.display = 'block'
      } else {
        this.errMsg = 'Please select project and supplier'
      }
    },
    goToProject: function () {
      document.getElementById('billing').style.display = 'none'
      document.getElementById('project').style.display = 'block'
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
</style>
