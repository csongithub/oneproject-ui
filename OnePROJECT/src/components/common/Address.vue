<template>
  <div class="Address">
    <div class="mt-0 ml-5 mr-5">
      <b-card v-if="address">
        <b-row>
          <b-col>
              <label><b>House Number:</b> {{address.houseNumber}}</label>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Village:</b> {{address.village}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Area:</b> {{address.area}}</label>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group>
               <label><b>Street:</b> {{address.street}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Post Office:</b> {{address.postOffice}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Police Station:</b> {{address.policeStation}}</label>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group>
               <label><b>Line One:</b> {{address.lineOne}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Line Two:</b> {{address.lineTwo}}</label>
            </b-form-group>
          </b-col>
          <b-col>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group>
               <label><b>District:</b> {{address.district}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>City:</b> {{address.city}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>State:</b> {{address.state}}</label>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group>
               <label><b>Country:</b> {{address.country}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Zip:</b> {{address.zip}}</label>
            </b-form-group>
          </b-col>
          <b-col>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group>
               <label><b>Phone One:</b> {{address.phoneOne}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Phone Two:</b> {{address.phoneTwo}}</label>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
               <label><b>Email Id:</b> {{address.email}}</label>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from '../../main.js'
export default {
  name: 'Address',
  components: {

  },
  props: {
    individual: {
      type: Object,
      default: null
    },
    entity: {
      type: String,
      default: 'IND'
    }
  },
  data () {
    return {
      baseAPI: config.SERVER_URL + 'AddressEndPoint/',
      address: {}
    }
  },
  methods: {
    getIndividualAddress: function () {
      let self = this
      axios.get(this.baseAPI + 'getIndividualAddress' + '/' + this.individual.individualId).then(response => {
        self.address = response.data
      }).catch(error => {
        self.$awn.alert(error.response.data.message)
      })
    }
  },
  mounted () {
    if (this.entity === 'IND') {
      this.getIndividualAddress()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
