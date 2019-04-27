<template>
  <div class="project-individual">
    <div class="mt-0 ml-5 mr-5">
      <b-form-group label-cols-sm="1" label="Select project: ">
        <b-input-group-append class="ml-4">
          <b-form-select class = "b-form-select" v-model="selectedProject"  @change="getSuppliersForProject" size="sm" style="width: 39%;">
            <option v-for="project in allProjects" v-bind:key="project.projectId" :value="project">{{project.projectName}}</option>
            <option slot="first" :value="null">Please Select a Project</option>
          </b-form-select>
        </b-input-group-append>
      </b-form-group>
    </div>
    <div class="mt-0 ml-5 mr-5" style="width:80%;">
      <result-table class="mt-1"  :actionable="selectedProject ? true: false" :enableDelete="enableDelete" :fields="fields" :data="projectSuppliers" :currentPage="currentPage" :perPage="perPage"
                                  @add="showAddSupplierModal"
                                  @refresh="getSuppliersForProject"/>
    </div>
    <b-modal id="addSupplierModal" ref="addSupplierModalRef" title="Add Supplier to Project" centered  size="md">
      <b-form>
        <b-row>
          <b-col>
            <b-form-group id="selectsupplier" label="Select a Supplier:" label-for="selectsupplier" title="Select a supplier to be added to this project">
              <b-form-select class="b-form-select" v-model="selectedSupplierId" size="sm">
                <option v-for="supplier in allSuppliers" v-bind:key="supplier.id" :value="supplier.id">{{'ID: ' + supplier.id + ',   Name: ' + supplier.supplierName + ',   Owner: ' + supplier.owner}}</option>
                <option slot="first" :value="null">Please Select a Supplier</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div slot="modal-footer" class="w-100">
        <b-button type="submit" class="b-button float-right px-2 " size="sm" variant="primary" v-on:click.prevent="addSuppliersToProject()">{{activeAction}}</b-button>
        <b-button type="reset" class="b-button float-right px-2 mr-2" size="sm" variant="secondary" v-on:click="hideAddSupplierModal()">Cancel</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../config.js'
import ResultTable from '../common/ResultTable'

export default {
  name: 'ProjectSuppliers',
  components: {
    'result-table': ResultTable
  },
  data () {
    return {
      clientId: 0,
      baseAPI: config.SERVER_URL + 'ProjectEndPoint/',
      supplierAPI: config.SERVER_URL + 'SupplierEndPoint/',
      currentPage: 1,
      perPage: 10,
      activeAction: 'Add',
      enableDelete: false,
      allProjects: [],
      allSuppliers: [],
      selectedProject: null,
      projectSuppliers: [],
      selectedSupplierId: null,
      fields: {
        projectId: {
          label: 'Project ID',
          sortable: true
        },
        id: {
          label: 'Supplier ID',
          sortable: false
        },
        supplierName: {
          label: 'Supplier Name',
          sortable: true
        },
        owner: {
          label: 'Owner Name',
          sortable: true
        },
        materials: {
          label: 'Product(s)',
          sortable: true
        }
      }
    }
  },
  methods: {
    showAddSupplierModal () {
      this.getClientSuppliers()
      this.activeAction = 'Add'
      this.$refs.addSupplierModalRef.show()
    },
    hideAddSupplierModal () {
      this.$refs.addSupplierModalRef.hide()
      this.selectedSupplierId = null
    },
    getSummarizedProjectsForClient () {
      let self = this
      axios.get(this.baseAPI + 'getSummarizedProjectsForClient' + '/' + this.clientId).then(response => {
        self.allProjects = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getClientSuppliers () {
      let self = this
      axios.get(this.supplierAPI + 'getClientSuppliers' + '/' + this.clientId).then(response => {
        if (this.projectSuppliers.length === 0) {
          self.allSuppliers = response.data
        } else {
          self.allSuppliers.splice(0, self.allSuppliers.length)
          var found = false
          for (var i = 0; i < response.data.length; i++) {
            found = false
            for (var j = 0; j < self.projectSuppliers.length; j++) {
              if (response.data[i].id === self.projectSuppliers[j].id) {
                found = true
                break
              }
            }
            if (!found) {
              self.allSuppliers.push(response.data[i])
            }
          }
        }
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    addSuppliersToProject () {
      let self = this
      let projectId = this.selectedProject.projectId
      axios.post(this.baseAPI + 'linkSupplier' + '/' + projectId + '/' + this.selectedSupplierId).then(response => {
        let o = response.data
        console.log(o)
        self.projectSuppliers = o
        for (let supplier of self.projectSuppliers) {
          supplier.projectId = projectId
        }
        self.hideAddSupplierModal()
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    },
    getSuppliersForProject () {
      let self = this
      let projectId = this.selectedProject.projectId
      axios.get(this.baseAPI + 'getProjectSupplier' + '/' + projectId).then(response => {
        let o = response.data
        console.log(o)
        self.projectSuppliers = o
        for (let supplier of self.projectSuppliers) {
          supplier.projectId = projectId
        }
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
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
