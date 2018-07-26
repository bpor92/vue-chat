<template>
  <div>
    <template>
      <loader :loading="loader" />
    </template>

    <template>
      <ul class="chatroom" v-chat-scroll>
        <li class="message" v-for="(item, index) in getConversation" :key="index">
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

      <v-text-field
        v-model="data.message"
        @keyup.enter="sendMessage"
        label="message:"
        type="text"
        />

        <span @click="sendMessage">save</span>


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
        message: ''
      },
        loader: false,
      	messages: [
      	{from: "Theodore", body: "As you can see, even though"},
      	{from: "Theodore", body: "I've got old messages loaded"},
      	{from: "Theodore", body: "the v-chat-scroll directive"},
      	{from: "Theodore", body: "will scroll to the bottom"},
      	{from: "Theodore", body: "on page load! Isn't that"},
      	{from: "Theodore", body: "really"},
      	{from: "Theodore", body: "really"},
      	{from: "Theodore", body: "cool?"}
      ]
    }
  },
  watch: {
    chatID() {
      debugger
      if(this.chatID === null) return
      this.loader = true
      this.$store.dispatch('initConversation', this.chatID).then(() => {
        this.loader = false
      })
    }
  },
  methods: {
    sendMessage() {
      this.$store.dispatch('sendMessage', this.data.message).then(() => {
        this.data.message = ''
      })
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
.chatroom {
  height: 500px;
  width: 80%;
  border: 1px solid black;
  padding: 10px 20px 5px 10px;
  overflow: auto;
}

</style>
