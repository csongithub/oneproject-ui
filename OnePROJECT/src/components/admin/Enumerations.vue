<template>
  <div class="enumerations">
    <b-modal id="createEnumModal" ref="createEnumModal" :title="title" centered  size="md">
      <b-form>
        <b-row>
          <b-col>
            <b-form-group id="enum" label="Enter A Value:" label-for="enum">
              <b-form-input class ="b-form-input mt-2" size="sm" id="enumInput" type="text" v-model="value" required placeholder="Enter A Value" />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div slot="modal-footer" class="w-100">
        <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click.prevent="addOption()">Create</b-button>
        <b-button type="reset" class="b-button float-right px-2 mr-2" variant="secondary" v-on:click="hideModal()">Cancel</b-button>
      </div>
    </b-modal>
    <b-row class="ml-5 mt-5">
      <b-col>
        <table border="1">
          <thead><th>Gender Type <i :class="'fa fa-plus operation ml-2'" style="float:right" v-on:click="showAddModal(enumerationTypes.gender)"/></th></thead>
          <tbody>
            <tr v-for="(gender, index) of genderTypes" :key="gender.name"><td>{{gender.name + ' '}}<i @click="deleteOption(enumerationTypes.gender, index)" :class="deleteIcon + ' float-right'" style="cursor:pointer; color:black;"/></td></tr>
          </tbody>
        </table>
      </b-col>
      <b-col class="ml-1">
        <table border="1">
          <thead><th size="sm">Project Type<i :class="'fa fa-plus operation ml-2'" style="float:right" v-on:click="showAddModal(enumerationTypes.projectType)"/></th></thead>
          <tbody>
            <tr v-for="(project, index) of projectTypes" :key="project.name"><td>{{project.name + ' '}} <i @click="deleteOption(enumerationTypes.projectType, index)" :class="deleteIcon + ' float-right'" style="cursor:pointer; color:black;"/></td></tr>
          </tbody>
        </table>
      </b-col>
      <b-col class="ml-1">
        <table border="1">
          <thead><th size="sm">KYC Documents<i :class="'fa fa-plus operation ml-2'" style="float:right" v-on:click="showAddModal(enumerationTypes.kycDocument)"/></th></thead>
          <tbody>
            <tr v-for="(document, index) of kycDocuments" :key="document.name"><td>{{document.name + ' '}}<i @click="deleteOption(enumerationTypes.kycDocument, index)" :class="deleteIcon + ' float-right'" style="cursor:pointer; color:black;"/></td></tr>
          </tbody>
        </table>
      </b-col>
      <b-col>
        <table border="1">
          <thead><th>Position Type<font-awesome-icon :class="'fa fa-plus operation ml-2'" style="float:right" v-on:click="showAddModal(enumerationTypes.position)"/></th></thead>
          <tbody>
            <tr v-for="(position, index) of positionTypes" :key="position.name"><td>{{position.name + ' '}}<i @click="deleteOption(enumerationTypes.position, index)" :class="deleteIcon + ' float-right'" style="cursor:pointer; color:black;"/></td></tr>
          </tbody>
        </table>
      </b-col>
      <b-col>
        <table border="1">
          <thead><th>Materials <i :class="'fa fa-plus operation ml-2'" style="float:right" v-on:click="showAddModal(enumerationTypes.material)"/></th></thead>
          <tbody>
            <tr v-for="(material, index) of materialTypes" :key="material.name"><td>{{material.name + ' '}}<i @click="deleteOption(enumerationTypes.material, index)" :class="deleteIcon + ' float-right'" style="cursor:pointer; color:black;"/></td></tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../main.js'
export default {
  name: 'Administration',
  data () {
    return {
      baseAPI: config.SERVER_URL + 'AdminEnumerationsPreferencesEndPoint/',
      deleteIcon: 'fa fa-minus',
      title: '',
      value: '',
      enumPreferences: {
        value: null,
        preferencesType: null
      },
      enumerationTypes: {
        gender: 'GENDER',
        projectType: 'PROJECT_TYPE',
        position: 'POSITION',
        kycDocument: 'KYC_DOCS',
        material: 'MATERIAL_TYPE'
      },
      genderTypes: [],
      projectTypes: [],
      positionTypes: [],
      kycDocuments: [],
      materialTypes: []
    }
  },
  methods: {
    showAddModal (obj) {
      if (obj === this.enumerationTypes.gender) {
        this.title = 'Define new gender'
        this.enumPreferences.preferencesType = this.enumerationTypes.gender
      } else if (obj === this.enumerationTypes.projectType) {
        this.title = 'Define new project'
        this.enumPreferences.preferencesType = this.enumerationTypes.projectType
      } else if (obj === this.enumerationTypes.position) {
        this.title = 'Define new position'
        this.enumPreferences.preferencesType = this.enumerationTypes.position
      } else if (obj === this.enumerationTypes.kycDocument) {
        this.title = 'Define new KYC Document'
        this.enumPreferences.preferencesType = this.enumerationTypes.kycDocument
      } else if (obj === this.enumerationTypes.material) {
        this.title = 'Define new material'
        this.enumPreferences.preferencesType = this.enumerationTypes.material
      }
      this.$refs.createEnumModal.show()
    },
    hideModal () {
      this.$refs.createEnumModal.hide()
      this.title = ''
      this.value = ''
      this.enumPreferences = {}
    },
    addOption () {
      if (this.enumPreferences.preferencesType === this.enumerationTypes.gender) {
        this.genderTypes.push({ 'name': this.value })
        this.enumPreferences.value = JSON.stringify(this.genderTypes)
      } else if (this.enumPreferences.preferencesType === this.enumerationTypes.projectType) {
        this.projectTypes.push({ 'name': this.value })
        this.enumPreferences.value = JSON.stringify(this.projectTypes)
      } else if (this.enumPreferences.preferencesType === this.enumerationTypes.position) {
        this.positionTypes.push({ 'name': this.value })
        this.enumPreferences.value = JSON.stringify(this.positionTypes)
      } else if (this.enumPreferences.preferencesType === this.enumerationTypes.kycDocument) {
        this.kycDocuments.push({ 'name': this.value })
        this.enumPreferences.value = JSON.stringify(this.kycDocuments)
      } else if (this.enumPreferences.preferencesType === this.enumerationTypes.material) {
        this.materialTypes.push({ 'name': this.value })
        this.enumPreferences.value = JSON.stringify(this.materialTypes)
      }
      let thisScope = this
      axios.put(this.baseAPI + 'addOrUpdatePreferences', this.enumPreferences).then(response => {
        let o = response.data
        thisScope.genderTypes = JSON.parse(o.genderJson) !== null ? JSON.parse(o.genderJson) : []
        thisScope.positionTypes = JSON.parse(o.positionJson) !== null ? JSON.parse(o.positionJson) : []
        thisScope.projectTypes = JSON.parse(o.projectTypeJson) !== null ? JSON.parse(o.projectTypeJson) : []
        thisScope.kycDocuments = JSON.parse(o.kycSupportedDocsJson) !== null ? JSON.parse(o.kycSupportedDocsJson) : []
        thisScope.materialTypes = JSON.parse(o.materialTypeJson) !== null ? JSON.parse(o.materialTypeJson) : []
        thisScope.$awn.success('Added Successfully')
        thisScope.hideModal()
      }).catch(error => {
        thisScope.$awn.alert(error.response.data.message)
      })
    },
    deleteOption (preferencesType, index) {
      let handleConfirm = function (thisScope) {
        thisScope.enumPreferences.preferencesType = preferencesType
        thisScope.enumPreferences.value = null
        if (thisScope.enumPreferences.preferencesType === thisScope.enumerationTypes.gender) {
          thisScope.genderTypes.splice(index, 1)
          thisScope.enumPreferences.value = JSON.stringify(thisScope.genderTypes)
        } else if (thisScope.enumPreferences.preferencesType === thisScope.enumerationTypes.projectType) {
          thisScope.projectTypes.splice(index, 1)
          thisScope.enumPreferences.value = JSON.stringify(thisScope.projectTypes)
        } else if (thisScope.enumPreferences.preferencesType === thisScope.enumerationTypes.position) {
          thisScope.positionTypes.splice(index, 1)
          thisScope.enumPreferences.value = JSON.stringify(thisScope.positionTypes)
        } else if (thisScope.enumPreferences.preferencesType === thisScope.enumerationTypes.kycDocument) {
          thisScope.kycDocuments.splice(index, 1)
          thisScope.enumPreferences.value = JSON.stringify(thisScope.kycDocuments)
        } else if (thisScope.enumPreferences.preferencesType === thisScope.enumerationTypes.material) {
          thisScope.materialTypes.splice(index, 1)
          thisScope.enumPreferences.value = JSON.stringify(thisScope.materialTypes)
        }
        axios.put(thisScope.baseAPI + 'addOrUpdatePreferences', thisScope.enumPreferences).then(response => {
          let o = response.data
          thisScope.genderTypes = JSON.parse(o.genderJson) !== null ? JSON.parse(o.genderJson) : []
          thisScope.positionTypes = JSON.parse(o.positionJson) !== null ? JSON.parse(o.positionJson) : []
          thisScope.projectTypes = JSON.parse(o.projectTypeJson) !== null ? JSON.parse(o.projectTypeJson) : []
          thisScope.kycDocuments = JSON.parse(o.kycSupportedDocsJson) !== null ? JSON.parse(o.kycSupportedDocsJson) : []
          thisScope.materialTypes = JSON.parse(o.materialTypeJson) !== null ? JSON.parse(o.materialTypeJson) : []
          thisScope.$awn.success('Added Successfully')
          thisScope.hideModal()
        }).catch(error => {
          thisScope.$awn.alert(error.response.data.message)
        })
      }
      let handleCancel = function () {
      }
      this.$awn.confirm('You are tyrying to delete ' + preferencesType + ', Are you sure?', handleConfirm(this), handleCancel)
    },
    getPreferences () {
      let thisScope = this
      axios.get(this.baseAPI + 'getPreferences').then(response => {
        let o = response.data
        thisScope.genderTypes = JSON.parse(o.genderJson) !== null ? JSON.parse(o.genderJson) : []
        thisScope.positionTypes = JSON.parse(o.positionJson) !== null ? JSON.parse(o.positionJson) : []
        thisScope.projectTypes = JSON.parse(o.projectTypeJson) !== null ? JSON.parse(o.projectTypeJson) : []
        thisScope.kycDocuments = JSON.parse(o.kycSupportedDocsJson) !== null ? JSON.parse(o.kycSupportedDocsJson) : []
        thisScope.materialTypes = JSON.parse(o.materialTypeJson) !== null ? JSON.parse(o.materialTypeJson) : []
      }).catch(error => {
        thisScope.$awn.alert(error.response.data.message)
      })
    }
  },
  mounted () {
    this.getPreferences()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.operation {
  cursor: pointer;
  font-size: 80%;
}
table th {
  background-color:lightgrey;
  color: green;
  font-size: 80%;
}
table tr {
   font-size: 75%;
   background-color: white;
}
</style>
