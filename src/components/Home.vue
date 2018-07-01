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
          <v-list-tile v-for="item in subscriptions" :key="item.text" avatar @click="test">
            <v-list-tile-avatar>
              <img :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`" alt="">
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>

        <v-list-tile @click="">
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
          v-model="model"
          :items="items"
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
  created() {
    db.collection('users').get().then(collection => {
      this.isLoading = false
      this.usersList = collection.docs.map(document => document.id)
    })
  },
  data() {
    return {
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      drawer: true,
      usersList: [],
      subscriptions: [
        { picture: 28, text: 'Joseph' },
        { picture: 38, text: 'Apple' },
        { picture: 48, text: 'Xbox Ahoy' },
        { picture: 58, text: 'Nokia' },
        { picture: 78, text: 'MKBHD' }
      ]
    }
  },
  methods: {
    test() {
      this.$router.push({ name: 'Chat'})
    }
  },
  computed: {
    items () {
      return this.entries
    }
  },
  watch: {
    search (val) {
      // Items have already been loaded
      if (this.items.length > 0) return

      this.isLoading = true

      // Lazily load input items
      db.collection('users').get().then(collection => {
        this.isLoading = false
        this.entries = collection.docs.map(document => document.id)
      }).finally(() => (this.isLoading = false))
    }
  }
}
</script>
