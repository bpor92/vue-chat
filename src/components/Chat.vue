<template>
  <div>
    <v-layout row v-if="chatID">
      <v-flex xs12 >
        <v-card>
          <v-list two-line>
            <template v-for="(item, index) in getConversation">
              <v-list-tile
                :key="item.title"
                avatar
              >
                <v-list-tile-avatar>
                  <span>{{item.name}}</span>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title v-html="item.message"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.timestamp"></v-list-tile-sub-title>
                </v-list-tile-content>

              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

    <v-form>
      <v-text-field
        v-model="data.message"
        name="login"
        label="text"
        type="text"
        />

        <span @click="sendMessage">save</span>
    </v-form>
  </div>
</template>

<script>
export default {
  props: {
    chatID: {
      type: String
    }
  },
  data() {
    return {
      data: {
        message: '',
        name: 'TEST'
      },
    }
  },
  watch: {
    chatID() {
      if(this.chatID === null) return

      this.$store.dispatch('initConversation', this.chatID).then(() => {
        debugger
      })
    }
  },
  methods: {
    sendMessage() {
      this.$store.dispatch('sendMessage', this.data)
    }
  },
  computed: {
    getConversation() {
      return this.$store.getters.getConversation
    }
  }
}
</script>

