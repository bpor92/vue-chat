<template>
  <div>

    <left-panel
      @notification="showNotification"
      @activeConversation="activeConversation"
      />

    <v-content>
        <v-alert
          :value="notification.active"
          :type="notification.type"
          transition="scale-transition"
          >
          {{notification.description}}
        </v-alert>

        <v-layout >
          <chat :chatID="chatID" />
          <router-view/>
        </v-layout>

    </v-content>
  </div>
</template>

<script>
import LeftPanel from './LeftPanel.vue'
import Chat from './Chat.vue'

export default {
  components: {
    LeftPanel,
    Chat
  },
  data() {
    return {
      notification: {
        description: '',
        type: 'success',
        active: false
      },
      chatID: null
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
    },
    activeConversation(id){
      this.chatID = id
    }
  }
}
</script>
