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
        <div v-if="loader.friends">
          <v-flex class="text-xs-center">
            <v-progress-circular
              align-center
              indeterminate
              color="white"/>
          </v-flex>

        </div>
        <div v-else>
          <v-list>
            <v-list-tile v-for="friend in getFriends" :key="friend.id" avatar @click="startChat(friend.login)">
              <v-list-tile-title v-text="friend.login"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </div>

        <v-subheader class="mt-3 grey--text text--darken-1">FRIEND REQUEST</v-subheader>

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
      <v-spacer></v-spacer>
      <span @click="logout">Logout</span>
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
import db from '@/firebase/init'
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
      loader:{
        friends: true
      }
    }
  },
  created() {
    this.initUserDetailsWithFriends()
    this.initUsersList()
  },
  methods: {
    initUsersList() {
      this.$store.dispatch('initUsersList')
    },
    initUserDetailsWithFriends() {
      this.$store.dispatch('initUserDetailsWithFriends').then(res => {
        this.loader.friends = false
      })
    },
    logout() {
      this.$store.dispatch('logout')
    },
    startChat(friendLogin) {
      this.$router.push({ name: 'Chat'})
    },
    addToFriends(value){
      if(value === undefined) return
      this.$store.dispatch('getUserDetailsByLogin', value).then(res => {
        this.userSelect = null
        debugger
        this.$store.dispatch('setFriendRequest', {...res, document: value, confirm: false, requestUserId: res.id}).then(res => {
          debugger
        })
      })
    }
  },
  computed: {
    getFriends () {
      return this.$store.getters.getFriends
    },
    usersList () {
      return this.$store.getters.getUsersList
    }
  }
}
</script>
