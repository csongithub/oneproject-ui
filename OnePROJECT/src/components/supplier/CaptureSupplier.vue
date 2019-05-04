<template>
  <div class="individual-basic">
    <div class="mt-0 ml-5 mr-5" style="width:80%;">
      <result-table class="mt-4"  :enableAdd=true :addText="'Add Supplier'" @add="showCaptureSupplier"
                                  :enableRefresh=true :refreshText="'Refresh'" @refresh="getClientSuppliers"
                                  :fields="fields" :data="allSuppliers" :currentPage="currentPage" :perPage="perPage"
                                  @edit="editSupplier"
                                  @delete="deleteSupplier"/>
    </div>
    <b-modal class="b-modal" id="captureSupplier" ref="captureSupplierRef" title="Capture Supplier" centered size="lg">
      <b-tabs size="sm">
        <b-tab title="Supplier Basic">
          <b-form>
            <b-row>
              <b-col>
                <b-form-group id="supplierName" label="Supplier Name:" label-for="supplierName" title="Represents name of Supplier">
                  <b-form-input class="b-form-input mt-2" size="sm" id="supplierNameInput" type="text" v-model.trim="supplier.supplierName" required placeholder="Enter Supplier Name" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="owner" label="Owner:" label-for="owner" title="Represents owner of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="ownerNameInput" type="text" v-model.trim="supplier.owner" required placeholder="Enter Owner Name" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="material" label="Slecte Materials:" label-for="material" title="Represents supplier's materials">
                  <multiselect v-model="supplier.materialsArray" :options="materialTypes.map(a => a.name)" :multiple="true" placeholder="Select materials">
                  </multiselect>
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </b-tab>
        <b-tab title="Supplier Address">
          <b-form>
            <b-row>
              <b-col>
                <b-form-group id="houseNumber" label="House Number:" label-for="houseNumber" title="Represents houe number of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm" id="houseNumber" type="text" v-model.trim="supplier.address.houseNumber" required placeholder="Enter House Number"/>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group id="village" label="Village/Town Name:" label-for="village" title="Represents village/town name of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="village" type="text" v-model.trim="supplier.address.village" required placeholder="Enter Village/Town Name" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="area" label="Area:" label-for="area" title="Represents living Area of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="area" type="text" v-model.trim="supplier.address.area" required placeholder="Enter Area Name" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group id="street" label="Street:" label-for="street" title="Represents Street of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="street" type="text" v-model.trim="supplier.address.street" required placeholder="Enter Street Name" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="postOffice" label="Post office:" label-for="postOffice" title="Represents Post Office of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="postOffice" type="text" v-model.trim="supplier.address.postOffice" required placeholder="Enter Post Office Name" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group id="policeStation" label="Police Station:" label-for="policeStation" title="Represents Police Station of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="policeStation" type="text" v-model.trim="supplier.address.policeStation" required placeholder="Enter Police Station Name" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="lineOne" label="Address Line 1:" label-for="lineOne" title="Represents Address Line 1 of  supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="lineOne" type="text" v-model.trim="supplier.address.lineOne" required placeholder="Enter line 1" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group id="lineTwo" label="Address Line 2:" label-for="lineTwo" title="Represents Address Line 2 of  supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="lineTwo" type="text" v-model.trim="supplier.address.lineTwo" required placeholder="Enter line 2" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="district" label="District:" label-for="district" title="Represents District of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="district" type="text" v-model.trim="supplier.address.district" required placeholder="Enter District Name" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group id="city" label="City:" label-for="city" title="Represents City of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="city" type="text" v-model.trim="supplier.address.city" required placeholder="Enter City Name" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="state" label="State:" label-for="state" title="Represents State of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="state" type="text" v-model.trim="supplier.address.state" required placeholder="Enter State Name" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group id="country" label="Country:" label-for="country" title="Represents Country of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="country" type="text" v-model.trim="supplier.address.country" required placeholder="Enter Country Name" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group id="zip" label="Zip Code:" label-for="zip" title="Represents Area Code of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="zip" type="text" v-model.trim="supplier.address.zip" required placeholder="Enter ZIP Code" />
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </b-tab>
        <b-tab title="Mobile & Email">
          <b-form>
            <b-row>
              <b-col>
                <b-form-group id="phoneOne" label="Phone/Mobile One:" label-for="phoneOne" title="Represents Phone or Mobile Number of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="phoneOne" type="text" v-model.trim="supplier.address.phoneOne" required placeholder="Enter Phone/Mobile Number" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="phoneTwo" label="Phone/Mobile Two:" label-for="phoneTwo" title="Represents Phone or Mobile Number of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="phoneTwo" type="text" v-model.trim="supplier.address.phoneTwo" required placeholder="Enter Phone/Mobile Number" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group id="email" label="Email:" label-for="email" title="Represents Email ID of supplier">
                  <b-form-input class="b-form-input mt-2" size="sm"  id="email" type="text" v-model.trim="supplier.address.email" required placeholder="Enter Email Id" />
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </b-tab>
      </b-tabs>
        <div slot="modal-footer" class="w-100">
          <b-button type="submit" class="b-button float-right px-2 " variant="primary" v-on:click="addOrUpdateSupplier()">{{activeAction}}</b-button>
          <b-button type="reset" class="b-button float-right px-2 mr-2" v-on:click="hideCaptureSupplier()">Cancel</b-button>
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
  name: 'Individuals',
  components: {
    'result-table': ResultTable
  },
  data () {
    return {
      clientId: 0,
      baseAPI: config.SERVER_URL + 'SupplierEndPoint/',
      enumerationBaseAPI: config.SERVER_URL + 'AdminEnumerationsPreferencesEndPoint/',
      currentPage: 1,
      perPage: 10,
      activeAction: 'Add',
      supplier: {
        supplierName: null,
        owner: null,
        materialsArray: null,
        address: {
          houseNumber: null,
          village: null,
          area: null,
          street: null,
          postOffice: null,
          policeStation: null,
          lineOne: null,
          lineTwo: null,
          district: null,
          city: null,
          state: null,
          country: null,
          zip: null,
          phoneOne: null,
          phoneTwo: null,
          email: null
        }
      },
      fields: {
        id: {
          label: 'Supplier ID',
          sortable: true
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
          label: 'Materials',
          sortable: true
        }
      },
      allSuppliers: [],
      materialTypes: []
    }
  },
  methods: {
    showCaptureSupplier () {
      this.$refs.captureSupplierRef.show()
    },
    hideCaptureSupplier () {
      this.$refs.captureSupplierRef.hide()
      this.supplier = {materials: null, address: {}}
      this.activeAction = 'Add'
    },
    addOrUpdateSupplier: function () {
      let self = this
      let materials = ''
      for (let m of this.supplier.materialsArray) {
        materials = materials + ', ' + m
      }
      Vue.set(this.supplier, 'materials', materials.slice(1))
      Vue.set(this.supplier, 'clientId', this.clientId)
      axios.put(this.baseAPI + 'addOrUpdateSupplier', this.supplier).then(response => {
        let o = response.data
        console.log(o)
        self.allSuppliers = o
        this.hideCaptureSupplier()
        this.$awn.success('Supplier Added Successfully.')
      }).catch(error => {
        this.$awn.alert(error.response.data.message)
      })
    },
    getClientSuppliers: function () {
      let self = this
      axios.get(this.baseAPI + 'getClientSuppliers' + '/' + this.clientId).then(response => {
        let o = response.data
        console.log(o)
        self.allSuppliers = o
      }).catch(error => {
        this.$awn.alert(error.response.data.message)
      })
    },
    editSupplier: function () {
    },
    deleteSupplier: function () {
    },
    getMaterials () {
      let self = this
      axios.get(this.enumerationBaseAPI + 'getPreferences' + '/' + this.clientId).then(response => {
        let o = response.data
        self.materialTypes = JSON.parse(o.materialTypeJson) !== null ? JSON.parse(o.materialTypeJson) : []
      })
    }
  },
  mounted () {
    this.clientId = this.$session.get('clientId')
    this.getMaterials()
    this.getClientSuppliers()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
