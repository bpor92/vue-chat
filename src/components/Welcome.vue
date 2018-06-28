<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar  dark color="primary" class="text-xs-center">
              <v-toolbar-title >Join to chat!</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field name="login" label="Login" type="text"></v-text-field>
                <v-text-field id="password" name="password" label="Password" type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
               <v-layout row justify-left ml-3>
                <v-dialog v-model="dialog" persistent max-width="500px">
                  <a slot="activator" align-left>Register</a>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Register</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12>
                            <v-text-field
                              label="Email"
                              required
                              v-model="register.email"/>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field
                              label="Password"
                              type="password"
                              required
                              v-model="register.password"/>
                          </v-flex>
                        </v-layout>
                      </v-container>
                      <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
                      <v-btn color="blue darken-1" flat @click.native="registerSave">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>

              <v-btn color="success">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-layout row justify-center>
      <v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
  </v-content>
</template>

<script>
import firebase from '@/firebase/config.js'

export default {
  data () {
    return {
      dialog: false,
      register: {
        email: '',
        password: ''
      },
      loading: false,
      errorMessage: null
    }
  },
  methods: {
    registerSave() {
      this.loading = true
      firebase.auth().createUserWithEmailAndPassword(this.register.email, this.register.password)
        .then(res => this.signIn(this.register.email, this.register.password))
        .catch((error) => { this.errorMessage = error.message })
    },
    signIn(email, password){
      return firebase.auth().signInWithEmailAndPassword(email, password)
        .then(res => this.$router.push({name: 'Dashboard'}))
        .catch((error) => { this.errorMessage = error.message })
    }
  }
}
</script>
<style>
.loading-dialog{
  background-color: #303030;
  opacity: 0.5;
}
</style>
