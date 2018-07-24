<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar  class=" grey--text text--darken-1 text-xs-center">
              <v-toolbar-title >Join to chat!</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="email"
                  name="login"
                  label="Email"
                  type="text"
                  :rules="[rules.required, rules.email]"
                  :error-messages="errors.emailMessage"
                  />
                <v-text-field
                  v-model="password"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  :rules="[rules.required]"
                  :error-messages="errors.passwordMessage"/>
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
                              :rules="[rules.required, rules.email]"
                              v-model="register.email"/>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field
                              label="Password"
                              type="password"
                              required
                              v-model="register.password"/>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field
                              label="Login"
                              required
                              :rules="[rules.required]"
                              :error-messages="errors.loginMessage"
                              v-model="register.login"/>
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

              <v-btn color="primary" @click.native="signIn(email, password)">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <loader :loading="loader" />
  </v-content>
</template>

<script>
import firebase from 'firebase'
import db from '../firebase/init'
import loader from './ui/loader.vue'

export default {
  components: { loader },
  data () {
    return {
      dialog: false,
      register: {
        email: '',
        password: '',
        login: ''
      },
      email: '',
      password: '',
      loader: false,
      errors: {
        emailMessage: [],
        passwordMessage: [],
        loginMessage: []
      },
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    registerSave() {
      this.loader = true

      let ref = db.collection('users').doc(this.register.login)
      ref.get().then(res => {
        if(res.exists){
          this.loader = false
          this.errors.loginMessage = 'Login is already exist.'
          return
        }

        firebase.auth().createUserWithEmailAndPassword(this.register.email, this.register.password)
        .then(res => {
          ref.set({
            friends: [],
            id: res.user.uid
          })
          .catch(err => {
            console.log(err)
          })
          this.signIn(this.register.email, this.register.password)
        })
        .catch((error) => {
          this.loader = false
          this.errorMessage = error.message
        })
      })
    },
    signIn(email, password){
      this.loader = true
      let that = this

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(res => {
          that.$router.push({name: 'Home'})
        })
        .catch((error) => {
          this.loader = false
          if(error.code === 'auth/user-not-found'){
            this.errors.emailMessage = error.message
          }
          if(error.code === 'auth/wrong-password'){
            this.errors.passwordMessage = error.message
          }
        })
    }
  }
}
</script>
<style>
.loading-dialog{
  background-color: rgba(125, 120, 120, 0.3);
  opacity: 0.5;
}
</style>
