<template>
  <div class="tooling">
    <div class="mt-0 ml-5 mr-5">
      <result-table class="mt-4"  :enableAdd=true :addText="'Add Machine'" @add="showCaptureMachine"
                                  :enableRefresh=true :refreshText="'Refresh'" @refresh="getClientMachines"
                                  :fields="fields" :data="machines" :currentPage="currentPage" :perPage="perPage"
                                  @edit="editMachine"/>
    </div>
    <b-modal class="b-modal" id="captureMachine" ref="captureMachineRef" title="Capture Machine" centered size="sm">
      <b-form>
        <b-row>
          <b-col>
            <b-form-group id="machineNumber" label="Machine Number:" label-for="machineNumber" title="Represents machine number.">
              <b-form-input class="b-form-input mt-2" size="sm" id="machineNumberInput" type="text" v-model.trim="machine.machineNumber" required placeholder="Enter Machine Number" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="machineName" label="Machine Name:" label-for="machineName" title="Represents machine name">
              <b-form-input class="b-form-input mt-2" size="sm"  id="machineNameInput" type="text" v-model.trim="machine.machineName" required placeholder="Enter Machine Name" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="machineType" label="Machine Type:" label-for="machineType" title="Represents type of the machine.">
              <b-form-select class = "b-form-select" v-model="machine.machineType" :options="machineTypes.map(a=>a.name)" size="sm">
                <option slot="first" :value="null">Choose</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="ownerId" label="Machine Owner:" label-for="ownerId" title="Represents machine owner">
              <b-form-select class="b-form-select" v-model="machine.ownerId" size="sm">
                <option v-for="individual in allIndividuals" v-bind:key="individual.individualId" :value="individual.individualId">{{'ID: ' + individual.individualId+ ', Name: ' + individual.firstName + ' ' + individual.middleName  + ' ' + individual.lastName}}</option>
                <option slot="first" :value="null">Please Select an Owner</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div slot="modal-footer" class="w-100">
        <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click="addMachine()">{{activeAction}}</b-button>
        <b-button type="reset" class="b-button float-right px-2 mr-2" v-on:click="hideCaptureMachine()">Cancel</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import ResultTable from '../common/ResultTable'
import {config} from '../../config.js'
export default {
  name: 'Tooling',
  components: {
    'result-table': ResultTable
  },
  data () {
    return {
      clientId: 0,
      baseAPI: config.SERVER_URL + 'MachineEndPoint/',
      individualAPI: config.SERVER_URL + 'IndividualEndPoint/',
      currentPage: 1,
      perPage: 10,
      activeAction: 'Add',
      machineTypes: [
        {'name': 'JCB'},
        {'name': 'Roller'},
        {'name': 'Water Tanker'},
        {'name': 'Tractor'},
        {'name': 'Compactor'},
        {'name': 'Hiva'},
        {'name': 'Mixer Machine'},
        {'name': 'Mini Truck'},
        {'name': 'Truck'}],
      machine: this.getNewMachine(),
      machines: [],
      fields: {
        machineId: {
          label: 'Machine ID',
          sortable: true
        },
        machineNumber: {
          label: 'Machine Number',
          sortable: true
        },
        machineName: {
          label: 'Machine Name',
          sortable: true
        },
        ownerId: {
          label: 'Owner Internal ID',
          sortable: true
        },
        ownerName: {
          label: 'Machine Owner'
        }
      },
      allIndividuals: []
    }
  },
  methods: {
    getNewMachine: function () {
      return {
        machineNumber: null,
        machineName: null,
        machineType: null,
        ownerId: null
      }
    },
    showCaptureMachine: function () {
      this.$refs.captureMachineRef.show()
    },
    hideCaptureMachine: function () {
      this.$refs.captureMachineRef.hide()
      this.machine = this.getNewMachine()
      this.activeAction = 'Add'
    },
    addMachine: function () {
      let self = this
      Vue.set(this.machine, 'clientId', this.clientId)
      axios.post(this.baseAPI + 'addMachine', this.machine).then(response => {
        self.getClientMachines()
        self.hideCaptureMachine()
        self.machine = self.getNewMachine()
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getClientMachines: function () {
      let self = this
      axios.get(this.baseAPI + 'getClientMachines' + '/' + this.clientId).then(response => {
        let o = response.data
        console.log(o)
        self.machines = o
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    editMachine: function () {
    },
    getClientIndividuals () {
      let self = this
      axios.get(this.individualAPI + 'getClientIndividuals' + '/' + this.clientId).then(response => {
        self.allIndividuals = response.data
        console.log(self.allIndividuals)
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    }
  },
  mounted () {
    this.clientId = this.$session.get('clientId')
    this.getClientMachines()
    this.getClientIndividuals()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
