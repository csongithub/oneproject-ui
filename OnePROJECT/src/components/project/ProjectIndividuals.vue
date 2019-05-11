<template>
  <div class="project-individual">
    <div class="mt-0 ml-5 mr-5">
      <b-form-group label-cols-sm="1" label="Select project: ">
        <b-input-group-append class="ml-4">
          <b-form-select class = "b-form-select" v-model="selectedProject"  @change="getIndividualsForProject" size="sm" style="width: 39%;">
            <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project">{{project.projectName}}</option>
            <option slot="first" :value="null">Please Select a Project</option>
          </b-form-select>
        </b-input-group-append>
      </b-form-group>
    </div>
    <div class="mt-0 ml-5 mr-5" style="width:80%;">
      <result-table class="mt-1"  :actionable="selectedProject ? true: false" :enableDelete="enableDelete" :fields="fields" :data="projectIndividuals" :currentPage="currentPage" :perPage="perPage"
                                  @add="showAddIndividualModal"
                                  @refresh="getIndividualsForProject"
                                  @edit="showEditProjectIndividual"
                                  @delete="deleteIndividualFromProject"/>
    </div>
    <b-modal id="addIndividualModal" ref="addIndividualRef" title="Add Individual to Project" centered  size="md">
      <b-form>
        <b-row>
          <b-col>
            <b-form-group id="selectindividual" label="Select an Individual:" label-for="selectindividual" title="Select an individual to be added to this project">
              <b-form-select class="b-form-select" v-model="individualMaping.individualId" size="sm">
                <option v-for="individual in allIndividuals" v-bind:key="individual.individualId" :value="individual.individualId">{{'ID: ' + individual.individualId+ ', Name: ' + individual.firstName + ' ' + individual.middleName  + ' ' + individual.lastName}}</option>
                <option slot="first" :value="null">Please Select an individual</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="role" label="Role in project:" label-for="position" title="Represents individual's role in project">
              <b-form-select class = "b-form-select" v-model="individualMaping.role" :options="positionTypes.map(a => a.name)" size="sm">
                <option slot="first" :value="null">Please Select a Role</option>
              </b-form-select>
            </b-form-group>
          </b-col>
           <b-col>
            <b-form-group id="joiningDate" label="Project Joinig Date:" label-for="joiningDate" title="Represents joining date of individual in project">
              <date-picker v-model="individualMaping.joiningDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div slot="modal-footer" class="w-100">
        <b-button type="submit" class="b-button float-right px-2 " size="sm" variant="primary" v-on:click.prevent="addIndividualToProject()">{{activeAction}}</b-button>
        <b-button type="reset" class="b-button float-right px-2 mr-2" size="sm" variant="secondary" v-on:click="hideAddIndividualModal()">Cancel</b-button>
      </div>
    </b-modal>
    <b-modal v-if="selectedProject" id="editIndividualModal" ref="editIndividualModalRef" title="Update Individual" centered  size="sm">
      <b-row class="mb-1 ml-3 mr-1">
        <b-col>Project: {{selectedProject.projectName}}</b-col><b-col></b-col>
      </b-row>
      <b-row class="mb-3 ml-3 mr-1">
        <b-col>Name: {{individualMaping.individualFullName}}</b-col><b-col></b-col>
      </b-row>
      <b-form>
        <b-row>
          <b-col>
            <b-form-group id="role" label="Role in project:" label-for="position" title="Represents individual's role in project">
              <b-form-select class = "b-form-select" v-model="individualMaping.role" :options="positionTypes.map(a => a.name)" size="sm">
                <option slot="first" :value="null">Please Select a Role</option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="joiningDate" label="Project Joinig Date:" label-for="joiningDate" title="Represents joining date of individual in project">
              <date-picker v-model="individualMaping.joiningDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div slot="modal-footer" class="w-100">
        <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click.prevent="updateIndividual()">{{activeAction}}</b-button>
        <b-button type="reset" class="b-button float-right px-2 mr-2" variant="secondary" v-on:click="hideEditProjectIndividual()">Cancel</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import {config} from '../../config.js'
import DatePicker from 'vue2-datepicker'
import ResultTable from '../common/ResultTable'

export default {
  name: 'Projects',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  data () {
    return {
      clientId: 0,
      baseAPI: config.SERVER_URL + 'ProjectEndPoint/',
      baseIndividualAPI: config.SERVER_URL + 'IndividualEndPoint/',
      enumerationBaseAPI: config.SERVER_URL + 'AdminEnumerationsPreferencesEndPoint/',
      currentPage: 1,
      perPage: 10,
      activeAction: 'Add',
      enableDelete: true,
      allProjects: [],
      allIndividuals: [],
      selectedProject: null,
      projectIndividuals: [],
      individualMaping: {
        projectId: null,
        individualId: null,
        role: null,
        joiningDate: null
      },
      positionTypes: [],
      fields: {
        projectId: {
          label: 'Project ID',
          sortable: true
        },
        individualId: {
          label: 'Individual ID',
          sortable: false
        },
        individualFullName: {
          label: 'Individual Name',
          sortable: true
        },
        role: {
          label: 'Role',
          sortable: true
        },
        joiningDate: {
          label: 'Joining Date',
          sortable: true
        },
        actions: {
          key: 'actions',
          label: 'Actions'
        }
      }
    }
  },
  methods: {
    showAddIndividualModal () {
      this.getClientIndividuals()
      this.activeAction = 'Add'
      this.$refs.addIndividualRef.show()
    },
    hideAddIndividualModal () {
      this.$refs.addIndividualRef.hide()
      this.individualMaping = {role: null, individualId: null}
    },
    getSummarizedProjectsForClient () {
      let self = this
      axios.get(this.baseAPI + 'getSummarizedProjectsForClient' + '/' + this.clientId).then(response => {
        self.allProjects = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getClientIndividuals () {
      let self = this
      axios.get(this.baseIndividualAPI + 'getClientIndividuals' + '/' + this.clientId).then(response => {
        if (this.projectIndividuals.length === 0) {
          self.allIndividuals = response.data
        } else {
          self.allIndividuals.splice(0, self.allIndividuals.length)
          var found = false
          for (var i = 0; i < response.data.length; i++) {
            found = false
            for (var j = 0; j < self.projectIndividuals.length; j++) {
              if (response.data[i].individualId === self.projectIndividuals[j].individualId) {
                found = true
                break
              }
            }
            if (!found) {
              self.allIndividuals.push(response.data[i])
            }
          }
        }
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    addIndividualToProject () {
      let self = this
      Vue.set(this.individualMaping, 'projectId', this.selectedProject.projectId)
      axios.post(this.baseAPI + 'linkIndividual', this.individualMaping).then(response => {
        self.projectIndividuals = response.data
        self.$awn.success('Individual Added Successfully')
        self.hideAddIndividualModal()
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getIndividualsForProject () {
      let self = this
      axios.get(this.baseAPI + 'getIndividualsForProject/' + this.selectedProject.projectId).then(response => {
        self.projectIndividuals = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getEnumerations () {
      let self = this
      axios.get(this.enumerationBaseAPI + 'getPreferences' + '/' + this.clientId).then(response => {
        let o = response.data
        self.positionTypes = JSON.parse(o.positionJson) !== null ? JSON.parse(o.positionJson) : []
      })
    },
    deleteIndividualFromProject (obj) {
      let self = this
      let handleConfirm = function () {
        axios.post(self.baseAPI + 'delinkIndividual/' + obj.projectId + '/' + obj.individualId).then(response => {
          let o = response.data
          self.projectIndividuals = o.projectIndividuals
          self.$awn.success('Individual Deleted Successfully')
        })
      }
      let handleCancel = function () {
      }
      this.$awn.confirm('You are tyrying to remove an individual from project, Are you sure?', handleConfirm, handleCancel)
    },
    showEditProjectIndividual (obj) {
      this.activeAction = 'Save Changes'
      Vue.set(this.individualMaping, 'individualFullName', obj.individualFullName)
      this.individualMaping.projectId = obj.projectId
      this.individualMaping.individualId = obj.individualId
      this.individualMaping.joiningDate = obj.joiningDate
      this.individualMaping.role = obj.role
      this.$refs.editIndividualModalRef.show()
    },
    hideEditProjectIndividual () {
      this.$refs.editIndividualModalRef.hide()
      this.individualMaping = {}
    },
    updateIndividual () {
      this.addIndividualToProject()
      this.hideEditProjectIndividual()
    }
  },
  mounted () {
    this.clientId = this.$session.get('clientId')
    this.getSummarizedProjectsForClient()
    this.getEnumerations()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
