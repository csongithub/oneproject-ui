<template>
  <div class="individualkyc">
    <div class="mt-0 ml-5 mr-5" style="width:80%; display: bold;" id="individualsTable">
      <result-table class="mt-1"  :expandable=true :expandAddress=true :actionable=true :enableAdd=false :enableRefresh=true :enableSearch=true
                                  :fields="fields" :data="individuals" :currentPage="currentPage" :perPage="perPage"
                                  @refresh="getSummarizedIndividuals"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../main.js'
import ResultTable from '../common/ResultTable'
export default {
  name: 'IndividualsComunication',
  components: {
    'result-table': ResultTable
  },
  data () {
    return {
      baseAPI: config.SERVER_URL + 'IndividualEndPoint/',
      currentPage: 1,
      perPage: 10,
      individuals: [],
      individual: {},
      address: {},
      fields: {
        expand: {
          key: 'expand',
          label: 'Expand'
        },
        individualId: {
          label: 'Individual ID',
          sortable: true
        },
        firstName: {
          label: 'First Name',
          sortable: false
        },
        middleName: {
          label: 'Middle Name',
          sortable: true
        },
        lastName: {
          label: 'Last Name',
          sortable: true
        }
      }
    }
  },
  methods: {
    getSummarizedIndividuals: function () {
      let self = this
      axios.get(this.baseAPI + 'getSummarizedIndividuals').then(response => {
        let o = response.data
        console.log(o)
        self.individuals = o
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    }
  },
  mounted () {
    this.getSummarizedIndividuals()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
