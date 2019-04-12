<template>
  <div>
    <adr v-if="entity==='Address'" :individual="item"></adr>
    <salary-comp v-else-if="entity==='Salary'" :individual="item" @payment="goToPaymentPage"></salary-comp>
  </div>
</template>

<script>
import Address from '../common/Address'
import Salary from '../billing/Salary'
export default {
  name: 'Salary',
  components: {
    'adr': Address,
    'salary-comp': Salary
  },
  props: {
    item: {},
    entity: {
      type: String,
      default: null
    }
  },
  data () {
    return {
    }
  },
  methods: {
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

</style>
