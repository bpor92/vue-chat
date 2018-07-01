<template>
  <div>
    <v-navigation-drawer
      fixed
      clipped
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-subheader class="mt-3 grey--text text--darken-1">FRIENDS</v-subheader>

        <v-list>
          <v-list-tile v-for="friend in userFriends" :key="friend.id" avatar @click="test">
            <v-list-tile-title v-text="friend.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Settings</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar
      color="red"
      dense
      fixed
      clipped-left
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-icon class="mx-3">fa-youtube</v-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Chat App</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-layout row align-center style="max-width: 650px">
        <v-autocomplete
          v-model="userSelect"
          @input="addToFriends"
          :items="usersList"
          :loading="isLoading"
          :search-input.sync="search"
          color="white"
          hide-no-data
          hide-selected
          item-text="Description"
          item-value="API"
          placeholder="Start typing to search user"
          prepend-icon="mdi-database-search"
          return-object
          class="mt-3"
        ></v-autocomplete>
      </v-layout>
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <v-layout justify-center align-center>
          <router-view/>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>
<script>
import { db } from '@/firebase/config'
import axios from 'axios'

export default {
  props: {
    source: String
  },
  data() {
    return {
      isLoading: false,
      userSelect: null,
      search: null,
      drawer: true,
    }
  },
  created() {
    this.initUsers()
  },
  methods: {
    initUsers() {
      this.$store.dispatch('initUsersList')
    },
    test() {
      this.$router.push({ name: 'Chat'})
    },
    addToFriends(value){
      if(value === undefined) return
      let userRef = db.collection('users').doc(value)
      userRef.get().then(user => {
        const data = user.data()

      })
    }
  },
  computed: {
    userFriends () {
      return this.$store.getters.getUserFriends
    },
    usersList () {
      return this.$store.getters.getUsersList
    }
  }
}
</script>
