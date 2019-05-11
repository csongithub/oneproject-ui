<template>
  <div class="projecttools">
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
    <div class="mt-0 ml-5 mr-5">
      <result-table class="mt-1"  :actionable="selectedProject ? true: false" :addText="'Add Machine'" :fields="fields" :data="projectMachines" :currentPage="currentPage" :perPage="perPage"
                                  @add="showAddMachineModal"
                                  @refresh="getProjectMachines"/>
    </div>
    <b-modal id="addMachineModal" ref="addMachineModalRef" title="Add Machine to Project" centered  size="md">
      <b-form>
        <b-row>
          <b-col>
            <b-form-group id="selectmachine" label="Select a Machine:" label-for="selectmachine" title="Select a machine to be added to this project">
              <b-form-select class="b-form-select" v-model="projectMachineLinkage.machine" size="sm">
                <option v-for="machine in allMachines" v-bind:key="machine.machineId" :value="machine">{{'Internal ID: ' + machine.machineId+ ',   Name: ' + machine.machineName + ',   Number: ' + machine.machineNumber + ',    Owner: ' + machine.ownerName}}</option>
                <option slot="first" :value="null">Please Select an individual</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group class="b-form-group" id="price" label="Runnig Cost:" label-for="price" title="Represents running cost of macine">
              <b-form-input size="sm" class="b-form-input mt-2" id="price" type="text" v-model="projectMachineLinkage.price" required placeholder="Enter Running Cost" />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="role" label="Running Cost Unit Per:" label-for="pricingUnit" title="Represents machine running cost unit. i.e. hour or month">
              <b-form-select class = "b-form-select" v-model="projectMachineLinkage.pricingUnit" :options="pricingUnits.map(a => a.name)" size="sm">
                <option slot="first" :value="null">Please Select a Unit</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="joinedOn" label="Engaged On:" label-for="projectStartDate" title="Represents engagement of machine in project">
              <date-picker class = "date-picker" v-model="projectMachineLinkage.joinedOn" :lang="'en'" :format="'DD-MM-YYYY'"></date-picker>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div slot="modal-footer" class="w-100">
        <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click.prevent="addMachineToProject()">Add</b-button>
        <b-button  type="reset" class="b-button float-right px-2 mr-2" v-on:click="cancel()">Cancel</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../config.js'
import DatePicker from 'vue2-datepicker'
import ResultTable from '../common/ResultTable'
export default {
  name: 'ProjectMachines',
  components: {
    'date-picker': DatePicker,
    'result-table': ResultTable
  },
  data () {
    return {
      clientId: 0,
      projectAPI: config.SERVER_URL + 'ProjectEndPoint/',
      machineAPI: config.SERVER_URL + 'MachineEndPoint/',
      currentPage: 1,
      perPage: 10,
      activeAction: 'Add',
      allProjects: [],
      projectMachines: [],
      selectedProject: null,
      fields: {
        machineId: {
          label: 'Internal ID',
          sortable: false
        },
        machineName: {
          label: 'Machine Name',
          sortable: true
        },
        machineNumber: {
          label: 'Machine Number',
          sortable: true
        },
        machineType: {
          label: 'Machine Category',
          sortable: true
        },
        owner: {
          label: 'Owner',
          sortable: true
        },
        charge: {
          label: 'Charge',
          sortable: true
        },
        joined: {
          label: 'Linked On',
          sortable: true
        }
      },
      allMachines: [],
      projectMachineLinkage: this.getNewLinkage(),
      pricingUnits: [{'name': 'Hour'}, {'name': 'Month'}]
    }
  },
  methods: {
    getNewLinkage: function () {
      return {
        machine: {},
        joinedOn: null,
        price: null,
        pricingUnit: null
      }
    },
    showAddMachineModal: function () {
      this.getClientMachines()
      this.activeAction = 'Add'
      this.$refs.addMachineModalRef.show()
    },
    hideShowAddMachineModal: function () {
      this.$refs.addMachineModalRef.hide()
    },
    getSummarizedProjectsForClient () {
      let self = this
      axios.get(this.projectAPI + 'getSummarizedProjectsForClient' + '/' + this.clientId).then(response => {
        self.allProjects = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getProjectMachines: function () {
      let self = this
      if (this.selectedProject === null) {
        self.projectMachines = []
      } else {
        axios.get(this.projectAPI + 'getProjectMachines' + '/' + this.selectedProject.projectId).then(response => {
          self.projectMachines = response.data
        }).catch(error => {
          self.$awn.alert(error.response.data.message)
        })
      }
    },
    getClientMachines: function () {
      let self = this
      axios.get(this.machineAPI + 'getClientMachines' + '/' + this.clientId).then(response => {
        if (self.allMachines.length === 0) {
          self.allMachines = response.data
        } else {
          self.allMachines.splice(0, self.allMachines.length)
          var found = false
          for (var i = 0; i < response.data.length; i++) {
            found = false
            for (var j = 0; j < self.projectMachines.length; j++) {
              if (response.data[i].machineId === self.projectIndividuals[j].machineId) {
                found = true
                break
              }
            }
            if (!found) {
              self.allMachines.push(response.data[i])
            }
          }
        }
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    addMachineToProject: function () {
      let self = this
      axios.post(this.projectAPI + 'addMachineToProject' + '/' + this.selectedProject.projectId, this.projectMachineLinkage).then(response => {
        self.projectMachines = response.data
        this.hideShowAddMachineModal()
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    cancel: function () {
      this.hideShowAddMachineModal()
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

</style>
