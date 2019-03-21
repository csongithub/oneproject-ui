<template>
  <div class="individual-basic">
    <div class="mt-0 ml-5 mr-5" style="width:80%;">
      <result-table class="mt-4"  :enableAdd=true :addText="'Add Individual'" @add="showCreateIndividualModal"
                                  :enableRefresh=true :refreshText="'Refresh'" @refresh="getAllIndividuals"
                                  :fields="fields" :data="allIndividuals" :currentPage="currentPage" :perPage="perPage"
                                  @edit="editIndividual"
                                  @delete="deleteIndividual"/>
    </div>
    <b-modal class="b-modal" id="createIndividual" ref="createIndividualModal" title="Basic Details" centered>
      <b-form>
        <b-row>
          <b-col>
            <b-form-group id="firstName" label="First Name:" label-for="firstName" title="Represents first name of individual">
              <b-form-input class="b-form-input mt-2" size="sm" id="firstNameInput" type="text" v-model.trim="individual.firstName" required placeholder="Enter First Name" />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="middleName" label="Middle Name:" label-for="middleName" title="Represents middle name of individual">
              <b-form-input class="b-form-input mt-2" size="sm"  id="middleNameInput" type="text" v-model.trim="individual.middleName" required placeholder="Enter Middle Name" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="lastName" label="Last Name:" label-for="lastName" title="Represents last name of individual">
              <b-form-input class="b-form-input mt-2" size="sm"  id="middleNameInput" type="text" v-model.trim="individual.lastName" required placeholder="Enter Last Name" />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="gender" label="Gender:" label-for="gender" title="Represents gender of individual">
              <b-form-select class="b-form-select" v-model="individual.gender" :options="genderTypes.map(a => a.name)" size="sm">
                <option slot="first" :value="null">Please Select a Gender</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="joiningDate" label="Joinig Date:" label-for="joiningDate" title="Represents joining date of individual">
              <date-picker v-model="individual.joiningDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="position" label="Position:" label-for="position" title="Represents individual's position in company">
              <b-form-select class = "b-form-select" v-model="individual.position" :options="positionTypes.map(a => a.name)" size="sm">
                <option slot="first" :value="null">Please Select a Position</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
        <div slot="modal-footer" class="w-100">
          <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click="addOrUpdateIndividual()">{{activeAction}}</b-button>
          <b-button type="reset" class="b-button float-right px-2 mr-2" v-on:click="hideCreateIndividualModal()">Cancel</b-button>
        </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import DatePicker from 'vue2-datepicker'
import ResultTable from '../common/ResultTable'
import {config} from '../../main.js'
export default {
  name: 'Individuals',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  data () {
    return {
      baseAPI: config.SERVER_URL + 'IndividualEndPoint/',
      enumerationBaseAPI: config.SERVER_URL + 'AdminEnumerationsPreferencesEndPoint/',
      currentPage: 1,
      perPage: 10,
      activeAction: 'Add',
      allIndividuals: [],
      individual: {
        firstName: null,
        middleName: null,
        lastName: null,
        gender: null,
        position: null,
        joiningDate: null
      },
      fields: {
        individualId: {
          label: 'ID',
          sortable: true
        },
        firstName: {
          label: 'First Name',
          sortable: true
        },
        middleName: {
          label: 'Middle Name',
          sortable: true
        },
        lastName: {
          label: 'Last Name',
          sortable: false
        },
        gender: {
          label: 'Gender',
          sortable: true
        },
        joiningDate: {
          label: 'Joinig Date',
          sortable: true
        },
        position: {
          label: 'Position',
          sortable: true
        },
        actions: {
          key: 'actions',
          label: 'Actions'
        }
      },
      positionTypes: [],
      genderTypes: []
    }
  },
  methods: {
    showCreateIndividualModal () {
      this.$refs.createIndividualModal.show()
    },
    hideCreateIndividualModal () {
      this.$refs.createIndividualModal.hide()
      this.individual = {gender: null, position: null}
      this.activeAction = 'Add'
    },
    addOrUpdateIndividual () {
      let thisScope = this
      axios.post(this.baseAPI + 'addOrUpdateIndividual', this.individual).then(response => {
        thisScope.allIndividuals = response.data
        this.$awn.success('Individual Added Successfully.')
        thisScope.hideCreateIndividualModal()
      }).catch(error => {
        this.$awn.alert(error.response.data.message)
      })
    },
    getAllIndividuals () {
      let thisScope = this
      axios.get(this.baseAPI + 'getAllIndividuals').then(response => {
        thisScope.allIndividuals = response.data
      }).catch(error => {
        this.$awn.alert(error.response.data.message)
      })
    },
    editIndividual (obj) {
      this.activeAction = 'Save Changes'
      this.individual = obj
      this.showCreateIndividualModal()
    },
    deleteIndividual (obj) {
      let thisScope = this
      let handleConfirm = function () {
        axios.delete(thisScope.baseAPI + 'deleteIndividual' + '/' + obj.individualId).then(response => {
          thisScope.allIndividuals = response.data
          this.$awn.success('Deleted Successfully.')
        }).catch(error => {
          this.$awn.alert(error.response.data.message)
        })
      }
      let handleCancel = function () {
      }
      this.$awn.confirm('You are tyrying to delete an individual, Are you sure?', handleConfirm, handleCancel)
    },
    getEnumerations () {
      let thisScope = this
      axios.get(this.enumerationBaseAPI + 'getPreferences').then(response => {
        let o = response.data
        thisScope.positionTypes = JSON.parse(o.positionJson) !== null ? JSON.parse(o.positionJson) : []
        thisScope.genderTypes = JSON.parse(o.genderJson) !== null ? JSON.parse(o.genderJson) : []
      })
    }
  },
  mounted () {
    this.getAllIndividuals()
    this.getEnumerations()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
