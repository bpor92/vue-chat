<template>
  <div>

    <left-panel @notification="showNotification" />

    <v-content>
        <v-alert
          :value="notification.active"
          :type="notification.type"
          transition="scale-transition"
          >
          {{notification.description}}
        </v-alert>

        <v-layout >
          <router-view/>
        </v-layout>

    </v-content>
  </div>
</template>

<script>
import LeftPanel from './LeftPanel.vue'

export default {
  components: {
    LeftPanel
  },
  data() {
    return {
      notification: {
        description: '',
        type: 'success',
        active: false
      }
    }
  },
  methods: {
    showNotification(detail){
      this.notification.description = detail.description
      this.notification.type = detail.type
      this.notification.active = true
      setTimeout(() => {
        this.notification.active = false
      }, 2000)
    }
  }
}
</script>
