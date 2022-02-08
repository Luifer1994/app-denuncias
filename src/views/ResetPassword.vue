<template>
  <main>
    <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
      <div class="container">
        <div class="col-lg-8 d-flex align-items-center justify-content-center">
          <div class="col-12 d-flex align-items-center justify-content-center">
            <div
              class="
                signin-inner
                my-3 my-lg-0
                bg-white
                shadow
                border-0
                rounded
                p-4 p-lg-5
                w-100
                fmxw-500
              "
            >
              <h1 class="h3">Restaurar contraseña</h1>
              <p class="mb-4">
                Introduce el código enviado a tu correo y escribe la nueva
                contraseña
              </p>

              <form v-on:submit.prevent="resetPassword()">
                <div class="mb-4">
                  <label for="email">Código</label>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      required
                      autofocus
                      v-model="cod"
                    />
                  </div>
                </div>
                <div class="mb-4">
                  <label for="email">Contraseña</label>
                  <div class="input-group">
                    <input
                      type="password"
                      class="form-control"
                      required
                      autofocus
                      v-model="password1"
                    />
                  </div>
                </div>
                <div class="mb-4">
                  <label for="email">Confirmar contraseña</label>
                  <div class="input-group">
                    <input
                      type="password"
                      class="form-control"
                      required
                      autofocus
                      v-model="password2"
                    />
                  </div>
                </div>
                <div class="d-grid" v-if="this.process">
                  <button type="submit" class="btn btn-gray-800">
                    Recuperar contraseña
                  </button>
                </div>
                <div class="d-grid" v-else>
                  <button type="submit" class="btn btn-gray-800" disabled>
                    <div class="spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>
                </div>
                <div class="mt-3 mb-4 text-center">
                  <router-link to="/login">Login</router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import axios from "axios";
export default {
  name: "ResetPassword",
  data() {
    return {
      cod: null,
      password1: null,
      password2: null,
      urlApi: process.env.VUE_APP_URL_API,
      process: true,
    };
  },
  methods: {
    async resetPassword() {
         this.process = false;
      if (this.password1 !== this.password2) {
        this.noty("Las contraseñas no coinciden", "error");
      } else {
        try {
          let content = new Object();
          content.cod = this.cod;
          content.password = this.password1;
          const res = await axios.post(this.urlApi + "reset-password", content);
          let message = res.data.message;
          this.noty(message, "info");
          this.$router.push("/login");
        } catch (error) {
           this.noty(error.response.data.message, "error");
        }
      }
       this.process = true;
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