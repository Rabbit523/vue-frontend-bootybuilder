import axios from "axios";
import { currentUser, apiUrl } from "../../constants/config";

export default {
  state: {
    currentUser:
      localStorage.getItem("user") != null
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null,
    changePasswordSuccess: null,
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
    changePasswordSuccess: state => state.changePasswordSuccess
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = false;
      state.loginError = null;
    },
    setLogout(state) {
      state.currentUser = null;
      state.processing = false;
      state.loginError = null;
    },
    setProcessing(state, payload) {
      state.processing = payload;
      state.loginError = null;
    },
    setError(state, payload) {
      state.loginError = payload;
      state.currentUser = null;
      state.processing = false;
    },
    setForgotMailSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.forgotMailSuccess = true;
    },
    setResetPasswordSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.resetPasswordSuccess = true;
    },
    setChangePasswordSuccess(state) {
      state.processing = false;
      state.loginError = null;
      state.changePasswordSuccess = true;
    },
    clearError(state) {
      state.loginError = null;
    }
  },
  actions: {
    login({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      axios
        .post(apiUrl + "/login", {
          email: payload.email,
          password: payload.password,
          workstationID: payload.workstationID
        })
        .then(response => {
          return response.data;
        })
        .then(res => {
          const item = {
            ...currentUser,
            uid: res.access_token,
            id: res.user.id,
            title: res.user.name,
            email: res.user.email,
            img: "/assets/img/avatar.jpg",
            date: res.user.created_at
          };

          localStorage.setItem("user", JSON.stringify(item));
          localStorage.setItem("token", res.access_token);
          commit("setUser", item);
        })
        .catch(err => {
          commit("setError", err.message);
        });
    },
    forgotPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      // firebase
      //   .auth()
      //   .sendPasswordResetEmail(payload.email)
      //   .then(
      //     user => {
      //       commit("clearError");
      //       commit("setForgotMailSuccess");
      //     },
      //     err => {
      //       commit("setError", err.message);
      //       setTimeout(() => {
      //         commit("clearError");
      //       }, 3000);
      //     }
      //   );
    },
    resetPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      // firebase
      //   .auth()
      //   .confirmPasswordReset(payload.resetPasswordCode, payload.newPassword)
      //   .then(
      //     user => {
      //       commit("clearError");
      //       commit("setResetPasswordSuccess");
      //     },
      //     err => {
      //       commit("setError", err.message);
      //       setTimeout(() => {
      //         commit("clearError");
      //       }, 3000);
      //     }
      //   );
    },

    changePassword({ commit }, payload) {
      var user = JSON.parse(localStorage.getItem('user'));
      if(!user) { return; }
      var token = localStorage.getItem('token');
      commit("clearError");
      commit("setProcessing", true);
      axios.post(apiUrl + '/change_password', {
        email: user.email,
        old: payload.old_password,
        new: payload.new_password,
      },{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return response.data;
      })
      .then(res => {
        if(res.res == 'error' ) {
          commit("setError", "Change password failed.");
        } else {
          commit("clearError");
          commit("setChangePasswordSuccess");
        }
      })
      .catch(err => {
        commit("setError", err.message);
        commit("setProcessing", false);
      });
    },

    /*
       return await auth.(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
    */
    signOut({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      commit("setLogout");
    }
  }
};
