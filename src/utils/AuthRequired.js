import { isAuthActive } from "../constants/config";
export default (to, from, next) => {
  if (isAuthActive) {
    next();
  } else {
    if (localStorage.getItem("token") != null) {
      // verify with firebase or jwt
      next();
    } else {
      localStorage.removeItem("token");
      next("/user/login");
    }
  }
};
