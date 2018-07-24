<template>
  <div>
    <template>
      <loader :loading="loader" />
    </template>

    <template>
      <v-card class="chat__container" >
        <ul two-line v-chat-scroll="{always: true, smooth: true}">
          <li v-for="(item, index) in getConversation" :key="index" >
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
          </li>
        </ul>
      </v-card>

      <v-form>
        <v-text-field
          v-model="data.message"
          name="login"
          label="text"
          type="text"
          />

          <span @click="sendMessage">save</span>
      </v-form>
    </template>

  </div>
</template>

<script>
import loader from './ui/loader.vue'

export default {
  components: { loader },
  props: {
    chatID: {
      type: String
    }
  },
  data() {
    return {
      data: {
        message: '',
        name: 'TEST',
        loader: false
      },
    }
  },
  watch: {
    chatID() {
      if(this.chatID === null) return
      this.loader = true
      this.$store.dispatch('initConversation', this.chatID).then(() => {
        this.loader = false
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

<style>
.chat__container {
  max-height: 400px;
  overflow: auto;
}
</style>
