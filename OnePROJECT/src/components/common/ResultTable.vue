<template>
  <div class="commontableheader">
      <b-input-group v-if="actionable">
        <!-- <span class="button" v-on:click="add()">{{addText}} <i :class="'fa fa-plus'"/></span> -->
        <b-button v-if="enableAdd" class="b-button btn-sm"  size="sm" variant="success" v-on:click="add()">{{addText}} <i :class="'fa fa-plus'"/></b-button>
        <b-button v-if="enableRefresh" class="b-button mb-0 ml-1" size="sm" variant="success" v-on:click="refresh()">{{refreshText}} <i :class="'fa fa-refresh'"/></b-button>
        <b-input-group-append v-if="enableSearch">
          <b-form-input class=" b-form-input ml-3" v-model="filter" placeholder="Type to Search" size="sm" style="width: 500px;"/>
        </b-input-group-append>
      </b-input-group>
    <b-pagination class="b-pagination" :total-rows="data.length" :per-page="perPage" v-model="currentPage" size="sm" align="right"/>
    <b-table class="b-table" style="cursor: default" striped hover responsive :items="data" :fields="fields" :filter="filter"
                                      :small="true"
                                      :fixed="true"
                                      :bordered="true"
                                      :current-page="currentPage"
                                      :per-page="perPage">
      <template v-if="expandable" slot="expand" slot-scope="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Hide ' : 'Show '}} {{expandableText}}
        </b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        <adr :item="row.item" :entity="expandableEntity" @payment="goToPaymentPage"></adr>
      </template>
      <template v-if="actionableColumn" slot="actions" slot-scope="row">
        <i :class="'fa fa-pencil'" class="ml-1" style="cursor: pointer; color: green" size="sm" @click="onEditClicked(row.item)"/>
        <i :class="'fa fa-trash'" class="ml-1" style="cursor: pointer; color: red" size="sm" @click="onDeleteClicked(row.item)" v-if="enableDelete"/>
      </template>
      <template slot="table-caption">Total Records: {{data.length}}</template>
    </b-table>
  </div>
</template>
<script>
import Child from '../common/ResultTableChild'
export default {
  name: 'Individuals',
  components: {
    'adr': Child
  },
  props: {
    expandable: {
      type: Boolean,
      default: false
    },
    expandableText: {
      type: String,
      default: 'Address'
    },
    expandableEntity: {
      type: String,
      default: null
    },
    actionable: {
      type: Boolean,
      default: true
    },
    enableAdd: {
      type: Boolean,
      default: true
    },
    addText: {
      type: String,
      default: 'Add'
    },
    enableRefresh: {
      type: Boolean,
      default: true
    },
    refreshText: {
      type: String,
      default: 'Refresh'
    },
    enableSearch: {
      type: Boolean,
      default: true
    },
    fields: Object,
    data: Array,
    currentPage: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 10
    },
    actionableColumn: {
      type: Boolean,
      default: true
    },
    enableDelete: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      filter: null,
      actions: {
        key: 'actions',
        label: 'Actions'
      },
      address: {}
    }
  },
  methods: {
    add () {
      this.$emit('add')
    },
    refresh () {
      this.$emit('refresh')
    },
    onEditClicked (item) {
      this.$emit('edit', item)
    },
    onDeleteClicked (item) {
      this.$emit('delete', item)
    },
    processExpandRequest (row) {
      row.item.expanded = !row.item.expanded
      // let o = row.toggleDetails
      // console.log(o)
    },
    goToPaymentPage (obj) {
      this.$emit('payment', obj)
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.b-table {
  font-size: 80%;
}
.button {
  color: black;
  cursor: pointer;
  background-color: lightgreen;
  padding-left: 3px;
  padding-right: 3px;
  padding-bottom: 2px;
  border-radius: 4px;
  color: white;
  font-size: 15px;
}
</style>
