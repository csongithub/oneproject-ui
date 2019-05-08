<template>
  <div class="project-general">
    <div class="mt-0 ml-5 mr-5">
      <result-table class="mt-4"  :enableAdd=true :addText="'Add Project'" @add="showCreateProjectModal"
                                  :enableRefresh=true :refreshText="'Refresh'" @refresh="getClientProjects"
                                  :fields="fields" :data="allProjects" :currentPage="currentPage" :perPage="perPage"
                                  :enableDelete="enableDelete"
                                  @edit="editProject"
                                  @delete="deleteProject"/>
    </div>
    <b-modal class="b-modal" id="createProjectModal" ref="createProjectModal" title="Create Project" centered  size="lg" @submit.prevent="submit">
      <b-tabs size="sm">
        <b-tab title="Project Details">
          <b-form>
            <b-row>
              <b-col>
                <b-form-group class="b-form-group" :state="validateProjectData.projectNameState" :invalid-feedback="'Project name is required'" id="projectName" label="Project Name:" label-for="projectName" title="Legal name of the project">
                  <b-form-input size="sm" class="b-form-input mt-2" id="projectNameInput" type="text" v-model="project.projectName" required placeholder="Enter Project Name" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group :state="validateProjectData.projectTypeState" :invalid-feedback="'Project type is required'" id="projectType" label="Project Type:" label-for="projectType" title="Type of the project, it might be road, canal, bridge etc">
                  <b-form-select class = "b-form-select" v-model="project.projectType" :options="projectTypes.map(a=>a.name)" size="sm">
                    <option slot="first" :value="null">Please Select a Project Type</option>
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group :state="validateProjectData.projectStartDateState" :invalid-feedback="'Project Start Date is required'" id="projectStartDate" label="Project Start Date:" label-for="projectStartDate" title="Actual Start Date of the project">
                  <date-picker class = "date-picker" v-model="project.projectStartDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group class = "date-picker" :state="validateProjectData.projectEndDateState" :invalid-feedback="'Project End Date is required'" id="projectEndDate" label="Project End Date:" label-for="projectEndDate" title="Actual completion date of the project">
                  <date-picker class = "date-picker" v-model="project.projectEndDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group :state="validateProjectData.projectCostState" :invalid-feedback="'Project cost is required'" id="projectCost" label="Project Cost (in INR):" label-for="projectCost" title="Actual cost of the project at which it has to be done">
                  <b-form-input size="sm" class="b-form-input mt-2" id="projectCostInput" type="text" v-model.trim="project.projectCost" required placeholder="Enter project cost in INR" />
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </b-tab>
        <b-tab title="BG Details">
          <b-form>
            <b-row>
              <b-col>
                <b-form-group class="b-form-group"  id="bgNumber" label="BG Number:" label-for="bgNumber" title="Represent Bg Number against security deposit">
                  <b-form-input size="sm" class="b-form-input mt-2" id="projectNameInput" type="text" v-model="project.bgNumber" required placeholder="Enter BG Number" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group class="b-form-group"  id="security" label="Security Amount:" label-for="bgNumber" title="Represent security deposit">
                  <b-form-input size="sm" class="b-form-input mt-2" id="projectNameInput" type="text" v-model="project.security" required placeholder="Enter Security Amount" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="securitySubmissionDate" label="Security Deposit Date:" label-for="projectStartDate" title="Represents date of security Deposit">
                  <date-picker class = "date-picker" v-model="project.securityDepositDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group class = "date-picker" id="securityExpiryDate" label="Security Expiry Date:" label-for="projectEndDate" title="Represents expiry date for security deposit.">
                  <date-picker class = "date-picker" v-model="project.securityExpiryDate" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </b-tab>
      </b-tabs>
      <div slot="modal-footer" class="w-100">
        <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click.prevent="addOrUpdateProject()">{{activeAction}}</b-button>
        <b-button  type="reset" class="b-button float-right px-2 mr-2" v-on:click="cancel()">Cancel</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>

import axios from 'axios'
import {config} from '../../config.js'
import DatePicker from 'vue2-datepicker'
// import { required } from 'vuelidate/lib/validators'
import ResultTable from '../common/ResultTable'

export default {
  name: 'Projects',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  computed: {
  },
  data () {
    return {
      clientId: 0,
      baseAPI: config.SERVER_URL + 'ProjectEndPoint/',
      enumerationBaseAPI: config.SERVER_URL + 'AdminEnumerationsPreferencesEndPoint/',
      currentPage: 1,
      perPage: 10,
      enableDelete: false,
      activeAction: 'Add',
      allProjects: [],
      projectTypes: [],
      project: {
        projectName: null,
        projectType: null,
        projectStartDate: null,
        projectEndDate: null,
        projectCost: null,
        bgNumber: null,
        security: null,
        securityDepositDate: null,
        securityExpiryDate: null
      },
      validateProjectData: {
        projectNameState: true,
        projectTypeState: true,
        projectStartDateState: true,
        projectEndDateState: true,
        projectCostState: true
      },
      fields: {
        projectId: {
          label: 'Project Id',
          sortable: true
        },
        projectName: {
          label: 'Project Name',
          sortable: true
        },
        projectType: {
          label: 'Project Type',
          sortable: false
        },
        projectStartDate: {
          label: 'Start Date',
          sortable: true
        },
        projectEndDate: {
          label: 'End Date',
          sortable: true
        },
        projectCost: {
          label: 'Cost',
          sortable: true
        },
        bgNumber: {
          label: 'BG Number',
          sortable: true
        },
        security: {
          label: 'Security',
          sortable: true
        },
        securityDepositDate: {
          label: 'Deposit Date',
          sortable: true
        },
        securityExpiryDate: {
          label: 'Expiry Date',
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
    showCreateProjectModal () {
      this.$refs.createProjectModal.show()
    },
    cancel () {
      this.$refs.createProjectModal.hide()
      this.project = {projectType: null}
      this.activeAction = 'Add'
      this.validateProjectData = {}
    },
    addOrUpdateProject () {
      let self = this
      if (!this.isValidProject()) {
        return
      }
      this.project.clientId = this.clientId
      if (this.project.projectId === null || this.project.projectId === undefined) {
        // Create New Project
        axios.post(this.baseAPI + 'addOrUpdateProject', this.project).then(response => {
          self.allProjects = response.data
          self.$awn.success('Project Added Successfully')
          self.cancel()
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      } else {
        // Update Existing Project
        let summarizedProject = {}
        summarizedProject.projectId = this.project.projectId
        summarizedProject.projectName = this.project.projectName
        summarizedProject.projectType = this.project.projectType
        summarizedProject.projectStartDate = this.project.projectStartDate
        summarizedProject.projectEndDate = this.project.projectEndDate
        summarizedProject.projectCost = this.project.projectCost
        summarizedProject.bgNumber = this.project.bgNumber
        summarizedProject.security = this.project.security
        summarizedProject.securityDepositDate = this.project.securityDepositDate
        summarizedProject.securityExpiryDate = this.project.securityExpiryDate
        axios.put(this.baseAPI + 'updateProject', summarizedProject).then(response => {
          self.allProjects = response.data
          self.$awn.success('Project Updated Successfully')
          self.cancel()
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }
    },
    getClientProjects () {
      let thisScope = this
      axios.get(this.baseAPI + 'getClientProjects' + '/' + this.clientId).then(response => {
        thisScope.allProjects = response.data
      }).catch(error => {
        thisScope.$awn.alert(error.response.data.message)
      })
    },
    getProjectType () {
      let thisScope = this
      axios.get(this.enumerationBaseAPI + 'getPreferences' + '/' + this.clientId).then(response => {
        let o = response.data
        thisScope.projectTypes = JSON.parse(o.projectTypeJson) !== null ? JSON.parse(o.projectTypeJson) : []
      })
    },
    editProject (obj) {
      this.activeAction = 'Save Changes'
      this.project = obj
      this.showCreateProjectModal()
    },
    deleteProject (obj) {
      let thisScope = this
      let handleConfirm = function () {
        axios.delete(thisScope.baseAPI + 'deleteProject' + '/' + obj.projectId).then(response => {
          thisScope.allProjects = response.data
          thisScope.$awn.success('Deleted Successfully.')
        }).catch(error => {
          thisScope.$awn.alert(error.response.data.message)
        })
      }
      let handleCancel = function () {
      }
      this.$awn.confirm('You are tyrying to delete a project, Are you sure?', handleConfirm, handleCancel)
    },
    isValidProject () {
      let isValid = true
      if (this.project.projectName === null || this.project.projectName.length <= 0) {
        isValid = false
        this.validateProjectData.projectNameState = false
      } else {
        isValid = true
        this.validateProjectData.projectNameState = true
      }
      if (this.project.projectType === null || this.project.projectType.length <= 0) {
        isValid = false
        this.validateProjectData.projectTypeState = false
      } else {
        isValid = true
        this.validateProjectData.projectTypeState = true
      }
      if (this.project.projectStartDate === null || this.project.projectStartDate.length <= 0) {
        isValid = false
        this.validateProjectData.projectStartDateState = false
      } else {
        isValid = true
        this.validateProjectData.projectStartDateState = true
      }
      if (this.project.projectEndDate === null || this.project.projectEndDate.length <= 0) {
        isValid = false
        this.validateProjectData.projectEndDateState = false
      } else {
        isValid = true
        this.validateProjectData.projectEndDateState = true
      }
      if (this.project.projectCost === null || this.project.projectCost.length <= 0) {
        isValid = false
        this.validateProjectData.projectCostState = false
      } else {
        isValid = true
        this.validateProjectData.projectCostState = true
      }
      return isValid
    }
  },
  mounted () {
    this.clientId = this.$session.get('clientId')
    this.getClientProjects()
    this.getProjectType()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#page1 {
  width:100px;
}
.ss-modal .modal-dialog {
    max-width: unset;
}
.ss-modal .modal-dialog .modal-content {
  width: 90%;
  height: 90%;
  margin: 0px auto;
  border: solid 1px #C0C0C0;
  box-shadow: 0 5px 15px #404040;
  transition: all .3s ease;
}
</style>
