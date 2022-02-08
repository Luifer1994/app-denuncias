<template>
  <div class="col-12 mb-4 mt-5">
    <div class="card shadow border-0 text-center p-0">
      <div class="card-body pb-5">
        <img
          class="avatar rounded-circle"
          alt="Image placeholder"
          src="https://www.shareicon.net/data/2016/05/26/771188_man_512x512.png"
          style="width: 150px; height: 150px"
        />
        <h4 class="h3">
          {{ this.$store.state.user.name }}
        </h4>
        <h6 class="h6">{{ this.$store.state.user.last_name }}</h6>
        <button
          class="btn btn-info btn-sm mb-2"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          <i class="fas fa-pencil-alt me-2"> </i>Editar
        </button>
        <br />
        <a
          class="
            btn btn-sm btn-gray-800
            d-inline-flex
            align-items-center
            me-2
            mb-2
          "
          href="#"
        >
          <i class="fas fa-mobile-alt"></i> <span class="m-1"></span>
          {{ this.$store.state.user.phone }}
        </a>
        <a class="btn btn-sm btn-secondary mb-2" href="#">
          <i class="fas fa-envelope-open-text"></i> <span class="m-1"></span>
          {{ this.$store.state.user.email }}
        </a>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">
            Actualizar Perfil
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h3>Datos básicos</h3>
          <hr />
          <div class="mb-3">
            <div class="row">
              <div class="col-sm-5 col-md-6">
                <label class="form-label">Nombres:</label>
                <input type="text" class="form-control" v-model="name" />
              </div>
              <div class="col-sm-5 col-md-6">
                <label class="form-label">Apellidos:</label>
                <input type="text" class="form-control" v-model="last_name" />
              </div>
              <div class="col-sm-5 col-md-6">
                <label class="form-label">Télefono:</label>
                <input type="text" class="form-control" v-model="phone" />
              </div>
              <div class="col-sm-12 col-md-12 d-grid gap-2">
                <button class="btn btn-info mt-2" @click="updatePerfil()">
                  Actualizar datos
                </button>
              </div>
            </div>
          </div>
          <h3>Cambiar contraseña</h3>
          <hr />
          <div class="mb-3">
            <div class="row">
              <div class="col-sm-5 col-md-6">
                <label class="form-label">Contraseña actual:</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="current_password"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-5 col-md-6">
                <label class="form-label">Nueva contraseña:</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="password"
                />
              </div>
              <div class="col-sm-5 col-md-6">
                <label class="form-label">Confirmar contraseña:</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="password_verify"
                />
              </div>
              <div class="col-sm-12 col-md-12 d-grid gap-2">
                <button class="btn btn-info mt-2" @click="updatePassword()">
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Perfil",
  data() {
    return {
      name: this.$store.state.user.name,
      last_name: this.$store.state.user.last_name,
      phone: this.$store.state.user.phone,
      data: [],
      urlApi: process.env.VUE_APP_URL_API,
      token: localStorage.getItem("token"),
      current_password: null,
      password: null,
      password_verify: null,
    };
  },
  methods: {
    async updatePerfil() {
      const data = new Object();
      data.name = this.name;
      data.last_name = this.last_name;
      data.phone = this.phone;
      const res = await axios.put(this.urlApi + "update-auth", data, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.$store.commit("userLogin", res.data.data);
      window.$("#staticBackdrop").modal("hide");
      this.noty(res.data.message, "info");
    },
    async updatePassword() {
      const data = new Object();
      data.current_password = this.current_password;
      data.password = this.password;
      if (this.password == this.password_verify) {
        try {
          const res = await axios.put(this.urlApi + "update-password", data, {
            headers: { Authorization: `Bearer ${this.token}` },
          });

          window.$("#staticBackdrop").modal("hide");
          this.noty(res.data.message, "info");
        } catch (error) {
           this.noty(error.response.data.message, "error");
        }
      } else {
        this.noty("Las contraseñas no coinciden", "error");
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

<style></style>
