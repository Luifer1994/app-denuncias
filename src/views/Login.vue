<template>
  <!-- Section -->
  <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
    <div class="container">
      <div class="col-lg-8 d-flex align-items-center justify-content-center">
        <div
          class="
            bg-white
            shadow
            border-0
            rounded
            border-light
            p-4 p-lg-5
            w-100
            fmxw-500
          "
        >
          <!-- Form -->
          <div class="form-group mb-4 mt-4">
            <label for="email">Email</label>
            <div class="input-group">
              <span class="input-group-text" id="basic-addon1">
                <i class="fas fa-envelope"></i>
              </span>
              <input
                v-model="userEmail"
                type="email"
                class="form-control"
                placeholder="example@email.com"
                id="email"
                autofocus
                required
              />
            </div>
          </div>
          <!-- End of Form -->
          <div class="form-group">
            <!-- Form -->
            <div class="form-group mb-4">
              <label for="password">Contraseña</label>
              <div class="input-group">
                <span class="input-group-text" id="basic-addon2">
                  <i class="fas fa-key"></i>
                </span>
                <input
                  v-model="userPassword"
                  type="password"
                  placeholder="Password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>
            </div>
          </div>
          <div class="d-grid">
            <button @click="login" class="btn btn-gray-800">Login</button>
          </div>

          <div class="d-flex justify-content-center align-items-center mt-4">
            <span class="fw-normal">
              No estas registrado?
              <a href="./sign-up.html" class="fw-bold">Crear cuenta</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      userEmail: null,
      userPassword: null,
      urlApi: process.env.VUE_APP_URL_API,
    };
  },
  methods: {
    async login() {
      try {
        let dataUser = new Object();
        dataUser.email = this.userEmail;
        dataUser.password = this.userPassword;
        let res = await axios.post(this.urlApi + "login", dataUser);

        if (res.data.data.user.rol.id == 1) {
          this.$store.commit("userLogin", res.data.data.user);
          this.message = res.data.data.message;
          this.noty(this.message, "info");
          localStorage.token = res.data.data.token;
          this.$router.push("/");
        } else {
          this.noty("No tienes permiso para entrar al sistema", "error");
        }
      } catch (error) {
        if (this.userEmail == "" || this.userPassword == "") {
          this.noty("Email y password son requeridos", "error");
        } else {
          this.noty("Email o Contraseña incorrecta", "error");
        }
      }
    },

    noty(message, typeMessage) {
      const notyf = new window.noty({
        position: {
          x: "rigth",
          y: "top",
        },
        types: [
          {
            type: "info",
            background: "#06AB17",
            icon: {
              className: "fas fa-check-double",
              tagName: "span",
              color: "#fff",
            },
            dismissible: false,
          },
        ],
      });
      notyf.open({
        type: typeMessage,
        message: message,
      });
    },
  },
};
</script>
