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
              <h1 class="h3">¿Olvidaste tu contraseña?</h1>
              <p class="mb-4">
                ¡No te preocupes! ¡Simplemente escriba su correo electrónico y
                le enviaremos un código para restablecer su contraseña!
              </p>

              <form v-on:submit.prevent="sendToken()">
                <div class="mb-4">
                  <label for="email">Email</label>
                  <div class="input-group">
                    <input
                      type="email"
                      class="form-control"
                      placeholder="email@email.com"
                      required
                      autofocus
                      v-model="email"
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
                  <router-link to="/reset-password"
                    >Ya tengo un código</router-link
                  >
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
  name: "ForgotPassword",
  data() {
    return {
      email: null,
      urlApi: process.env.VUE_APP_URL_API,
      process: true,
    };
  },
  methods: {
    async sendToken() {
      this.process = false;
      try {
        let content = new Object();
        content.email = this.email;
        const res = await axios.post(
          this.urlApi + "send-token-reset-password",
          content
        );
        let message = res.data.message;
        this.noty(message, "info");
        this.$router.push("/reset-password");
      } catch (error) {
        this.noty(error.response.data.message, "error");
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