<template>
  <div class="Salary">
    <div class="mt-0 ml-5 mr-5">
      <b-card v-if="salary.id">
        <b-row>
          <b-col>
              <label><b>Salary:</b> {{'INR ' + salary.salary + ' Per ' + salary.interval}}</label>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Effective From:</b> {{salary.effectiveFrom}}</label>
            </b-form-group>
          </b-col>
          <!-- <b-col>
            <b-form-group>
               <label><b>Effective To:</b> {{salary.effectiveTo}}</label>
            </b-form-group>
          </b-col> -->
          <b-col>
            <b-form-group>
               <label><b>Status:</b> {{salary.status}}</label>
            </b-form-group>
          </b-col>
        </b-row>
        <b-button class="b-button mb-0 ml-1" size="sm" variant="success" v-on:click="getIndividualSalary()">Refresh <i :class="'fa fa-refresh'"/></b-button>
        <b-button class="b-button mb-0 ml-1" size="sm" variant="success" v-on:click="goToPaymentPage()">Go To Payment</b-button>
      </b-card>
      <b-card v-if="!salary.id">
        <b-form>
          <!-- <label><b>Salary is not yet configured, Please Configure it</b></label> -->
          <b-row>
            <b-col>
              <b-form-group class="b-form-group" id="salary" label="Enter Salary(In INR):" label-for="salary" title="Represents Salry of an Individual">
              <b-form-input size="sm" class="b-form-input mt-2" id="salary" type="text" v-model="addSalary.salary" required placeholder="Enter Salary"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="interval" label="Salary Interval:" label-for="interval" title="Represents interval of Salry of an Individual">
              <b-form-select class = "b-form-select" v-model="addSalary.interval" :options="salaryIntervalTypes.map(a=>a.name)" size="sm">
                <option slot="first" :value="null">Choose</option>
              </b-form-select>
            </b-form-group>
            </b-col>
            <b-col>
              <b-form-group class = "date-picker"  id="effectiveFrom" label="Effective From:" label-for="effectiveFrom" title="Actual completion date of the project">
                <date-picker class = "date-picker" v-model="addSalary.effectiveFrom" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col>
            <!-- <b-col>
              <b-form-group class = "date-picker"  id="effectiveTo" label="Effective To:" label-for="effectiveTo" title="Actual completion date of the project">
                <date-picker class = "date-picker" v-model="addSalary.effectiveTo" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
              </b-form-group>
            </b-col> -->
          </b-row>
          <b-button type="submit" class="b-button float-left" variant="success" v-on:click.prevent="createSalary()">Create Salary</b-button>
          <b-button type="submit" class="b-button float-left ml-1" variant="secondary" v-on:click.prevent="reset()">Reset</b-button>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../config.js'
import DatePicker from 'vue2-datepicker'
// import { required } from 'vuelidate/lib/validators'
import ResultTable from '../common/ResultTable'
export default {
  name: 'Salary',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  props: {
    individual: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      clientId: 0,
      baseAPI: config.SERVER_URL + 'IndividualEndPoint/',
      enumerationBaseAPI: config.SERVER_URL + 'AdminEnumerationsPreferencesEndPoint/',
      baseAPIForSalary: config.SERVER_URL + 'SalaryEndPoint/',
      salary: {
        salary: null,
        interval: null,
        effectiveFrom: null,
        effectiveTo: null,
        status: null
      },
      addSalary: {
        individualId: null,
        salary: null,
        interval: null,
        effectiveFrom: null,
        effectiveTo: null,
        status: 'Active'
      },
      salaryIntervalTypes: []
    }
  },
  methods: {
    getIndividualSalary: function () {
      let self = this
      axios.get(this.baseAPI + 'getIndividualsSalary' + '/' + this.individual.individualId).then(response => {
        self.salary = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getSalaryIntervals () {
      let thisScope = this
      axios.get(this.enumerationBaseAPI + 'getPreferences' + '/' + this.clientId).then(response => {
        let o = response.data
        thisScope.salaryIntervalTypes = JSON.parse(o.salaryIntervalJson) !== null ? JSON.parse(o.salaryIntervalJson) : []
      })
    },
    createSalary () {
      let self = this
      this.addSalary.individualId = this.individual.individualId
      axios.post(this.baseAPIForSalary + 'addSalary', this.addSalary).then(response => {
        self.salary = response.data
        self.addSalary = {}
        self.$awn.success('Salary Created')
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    reset () {
    },
    goToPaymentPage () {
      this.$emit('payment', {'individual': this.individual, 'salary': this.salary})
    }
  },
  mounted () {
    this.clientId = this.$session.get('clientId')
    this.getSalaryIntervals()
    this.getIndividualSalary()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
