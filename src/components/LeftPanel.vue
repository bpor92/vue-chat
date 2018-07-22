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
            <v-list-tile v-for="friend in getFriends" :key="friend.id" avatar @click="startChat(friend.chatID)">
              <v-list-tile-title v-text="friend.login"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </div>

        <v-subheader class="mt-3 grey--text text--darken-1">FRIEND REQUEST</v-subheader>
        <v-list>
          <v-list-tile v-for="friend in getRequestFriends" :key="friend.id">
            <v-list-tile-title v-text="friend.login" @click="startChat(friend.login)"></v-list-tile-title>
            <span @click="acceptFriendRequest(friend.login)" class="pointner mr-2"><v-icon dark right>check_circle</v-icon></span>
            <span @click="declineFriendRequest(friend.login)" class="pointner"><v-icon dark right>block</v-icon></span>
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
      color="blue-grey darken-1"
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
      <span class="mr-5 grey--text lighten-3--text">{{getUserLogin}}</span>
      <span @click="logout">Logout</span>
    </v-toolbar>
  </div>
</template>

<script>
import db from '@/firebase/init'
import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      userSelect: null,
      search: null,
      drawer: true,
      sentFriendRequest: false,
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
    startChat(id) {
      this.$router.push({ name: 'Chat', params: {id}})
    },
    showNotification(notification){
      this[notification] = false
      setTimeout(() => {
        this[notification] = false
      }, 2000)
    },
    addToFriends(value){
      if(value === undefined) return
      this.$store.dispatch('getUserDetailsByLogin', value).then(res => {
        this.$emit('notification', {type: 'success', description: 'Friend request successfully sent'})
        this.userSelect = ''
        this.$store.dispatch('setFriendRequest', {...res, document: value, confirm: false, requestUserId: res.id}).then(res => {
        })
      })
    },
    acceptFriendRequest(login){
      this.$store.dispatch('acceptFriendRequest', {login})
    },
    declineFriendRequest(login) {
      this.$store.dispatch('declineFriendRequest', login)
    }
  },
  computed: {
    getFriends () {
      return this.$store.getters.getFriends
    },
    getRequestFriends() {
      return this.$store.getters.getFriendsRequest
    },
    getAllFriends() {
      return this.$store.getters.getAllFriends
    },
    getUserLogin() {
      return this.$store.getters.getUserLogin
    },
    usersList () {
      const userList = this.$store.getters.getUsersList
      const friendsList = this.$store.getters.getAllFriends.map(user=> user.login)

      return userList
        .filter(user => !friendsList.includes(user))
        .concat(friendsList.filter(friend => !userList.includes(friend)));
    }
  }
}
</script>

<style>
  .pointner {
    cursor: pointer;
  }
</style>
