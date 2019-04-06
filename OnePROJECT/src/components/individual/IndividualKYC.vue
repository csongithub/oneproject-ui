<template>
  <div class="individualkyc">
    <div class="mt-0 ml-5 mr-5" style="width:80%;">
      <result-table class="mt-1"  :actionable=true :enableAdd=false :enableRefresh=true :enableSearch=true :enableDelete=false
                                  :fields="fields" :data="kycData" :currentPage="currentPage" :perPage="perPage"
                                  @edit="updateKYC"
                                  @refresh="getKYCData"/>
    </div>
    <b-modal class="b-modal" id="updateKYC" ref="updateKYCRef" centered="" title="Update KYC" button-size="sm">
      <b-row class="mb-3 ml-1">
        <b-co>Name: {{kycDataWrapper.fullName}}</b-co><b-col></b-col>
      </b-row>
      <b-row>
          <b-col>
            <b-form-group id="documentType" label="Document:" label-for="documentType" title="Represents the type of document for KYC">
              <b-form-select class="b-form-select" v-model="kycDataWrapper.document" :options="documentsType.map(a=>a.name)" size="sm">
                <option slot="first" :value="null">Please Select a Document</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="documentId" label="Document ID:" label-for="documentId" title="Represents the selected document id for KYC">
              <b-form-input class="b-form-input mt-2" size="sm" id="documentId" type="text" v-model="kycDataWrapper.documentId" required placeholder="Enter the Document Id" />
            </b-form-group>
          </b-col>
        </b-row>
        <div slot="modal-footer" class="w-100">
        <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click.prevent="confirmKYC()">Confirm KYC</b-button>
        <b-button type="reset" class="b-button float-right px-2 mr-2" v-on:click="hideUpdateKYCModal()">Cancel</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../main.js'
import ResultTable from '../common/ResultTable'
export default {
  name: 'Individuals KYC',
  components: {
    'result-table': ResultTable
  },
  data () {
    return {
      baseAPI: config.SERVER_URL + 'IndividualEndPoint/',
      enumerationBaseAPI: config.SERVER_URL + 'AdminEnumerationsPreferencesEndPoint/',
      currentPage: 1,
      perPage: 10,
      allIndividuals: [],
      kycData: [],
      fields: {
        individualId: {
          label: 'Individual ID',
          sortable: true
        },
        fullName: {
          label: 'Full Name',
          sortable: false
        },
        document: {
          label: 'Document Type',
          sortable: true
        },
        documentId: {
          label: 'Document ID',
          sortable: true
        },
        status: {
          label: 'Status',
          sortable: true
        },
        confirmationDate: {
          label: 'Confirmed On',
          sortable: true
        },
        actions: {
          key: 'actions',
          label: 'Actions'
        }
      },
      documentsType: [],
      kycDataWrapper: this.getNewKYCWrapper()
    }
  },
  methods: {
    showUpdateKYCModal () {
      this.$refs.updateKYCRef.show()
    },
    hideUpdateKYCModal () {
      this.$refs.updateKYCRef.hide()
      this.kycDataWrapper = this.getNewKYCWrapper()
    },
    getNewKYCWrapper () {
      let newKYCWrapper = {
        individualId: null,
        fullName: null,
        document: null,
        documentId: null,
        status: null,
        confirmationDate: null
      }
      return newKYCWrapper
    },
    getKYCData () {
      let thisScope = this
      axios.get(this.baseAPI + 'getKYCData').then(response => {
        thisScope.kycData = response.data
      }).catch(error => {
        thisScope.$awn.alert(error.response.data.message)
      })
    },
    updateKYC (obj) {
      this.kycDataWrapper.individualId = obj.individualId
      this.kycDataWrapper.fullName = obj.fullName
      this.kycDataWrapper.document = obj.document
      this.kycDataWrapper.documentId = obj.documentId
      this.kycDataWrapper.status = 'Confirmed'
      this.showUpdateKYCModal()
    },
    confirmKYC () {
      let thisScope = this
      axios.put(thisScope.baseAPI + 'confirmKYC', this.kycDataWrapper).then(response => {
        thisScope.kycData = response.data
        thisScope.$awn.success('KYC Updated Successfully')
        thisScope.hideUpdateKYCModal()
      }).catch(error => {
        thisScope.$awn.alert(error.response.data.message)
      })
    },
    getDocumentsType () {
      let thisScope = this
      axios.get(this.enumerationBaseAPI + 'getPreferences').then(response => {
        let o = response.data
        thisScope.documentsType = JSON.parse(o.kycSupportedDocsJson) !== null ? JSON.parse(o.kycSupportedDocsJson) : []
      }).catch(error => {
        thisScope.$awn.alert(error.response.data.message)
      })
    }
  },
  mounted () {
    this.getDocumentsType()
    this.getKYCData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
