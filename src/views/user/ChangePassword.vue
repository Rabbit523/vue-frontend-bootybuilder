<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <p class="text-white h2">{{ $t('dashboards.app-title') }}</p>
          <p class="white mb-0">
            Please use your credentials to login.
            <br />If you are not a member, please
            <router-link tag="a" to="/user/register" class="white">register</router-link>.
          </p>
        </div>
        <div class="form-side">
          <router-link tag="a" to="/">
            <span class="logo-single" />
          </router-link>

          <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
            <b-form-group label="Current Password" class="has-float-label mb-4">
              <b-form-input
                type="password"
                v-model="$v.form.old_password.$model"
                :state="!$v.form.old_password.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.old_password.required">Please enter your password</b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!$v.form.old_password.minLength || !$v.form.old_password.maxLength"
              >Your password must be between 4 and 16 characters</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="New Password" class="has-float-label mb-4">
              <b-form-input
                type="password"
                v-model="$v.form.new_password.$model"
                :state="!$v.form.new_password.$error"
              />
              <b-form-invalid-feedback v-if="!$v.form.new_password.required">Please enter your password</b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!$v.form.new_password.minLength || !$v.form.new_password.maxLength"
              >Your password must be between 4 and 16 characters</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group :label="$t('user.password-again')" class="has-float-label mb-4">
              <b-form-input
                type="password"
                v-model="$v.form.passwordAgain.$model"
                :state="!$v.form.passwordAgain.$error"
              />
              <b-form-invalid-feedback
                v-if="!$v.form.passwordAgain.required"
              >Please enter your password again</b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!$v.form.passwordAgain.sameAsPassword"
              >Your inputs does not match</b-form-invalid-feedback>
            </b-form-group>
              
            <b-button
              type="submit"
              variant="primary"
              size="lg"
              :disabled="processing"
              :class="{'btn-multiple-state': true,
                  'float-right': true,
                  'show-spinner': processing,
                  'show-success': !processing && loginError===false,
                  'show-fail': !processing && loginError }"
            >
              <span class="spinner d-inline-block">
                <span class="bounce1"></span>
                <span class="bounce2"></span>
                <span class="bounce3"></span>
              </span>
              <span class="icon success">
                <i class="simple-icon-check"></i>
              </span>
              <span class="icon fail">
                <i class="simple-icon-exclamation"></i>
              </span>
              <span class="label">{{ $t('user.reset-password-button') }}</span>
            </b-button>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
const {
  required,
  maxLength,
  minLength,
  email,
  sameAs
} = require("vuelidate/lib/validators");

export default {
  data() {
    return {
      form: {
        old_password: "",
        new_password: "",
        passwordAgain: ""
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      old_password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(4)
      },
      new_password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(4)
      },
      passwordAgain: {
        required,
        sameAsPassword: sameAs("new_password")
      }
    }
  },
  computed: {
    ...mapGetters([
      "currentUser",
      "processing",
      "loginError",
      "changePasswordSuccess"
    ]),
  },
  methods: {
    ...mapActions(["changePassword", "signOut"]),
    formSubmit() {
      this.$v.form.$touch();
      if (!this.$v.form.$anyError) {
        this.changePassword({
          old_password: this.form.old_password,
          new_password: this.form.new_password,
        });
      }
    }
  },
  watch: {
    loginError(val) {
      if (val != null) {
        this.$notify("error", "Reset Password Error", val, {
          duration: 3000,
          permanent: false
        });
      }
    },
    changePasswordSuccess(val) {
      if (val) {
        this.$notify(
          "success",
          "Change Password Success",
          "Change password success",
          {
            duration: 3000,
            permanent: false
          }
        );
        this.signOut().then(() => {
          this.$router.push("/user/login");
        });
      }
    }
  }
};
</script>
