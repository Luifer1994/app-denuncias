
<template>
  <div
    class="
      d-flex
      justify-content-between
      flex-wrap flex-md-nowrap
      align-items-center
      py-4
    "
  >
    <div class="d-block mb-4 mb-md-0">
      <h2 class="h4">Funcionarios</h2>
    </div>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group ms-2 ms-lg-3">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#registerUser"
          @click="
            getTypePeople(), getTypeDocument(), getRols(), getProfessions()
          "
        >
          Registrar
        </button>
      </div>
    </div>
  </div>
  <div class="table-settings mb-4">
    <div class="row align-items-center justify-content-between">
      <div class="col col-md-6 col-lg-3 col-xl-4">
        <div class="input-group me-2 me-lg-3 fmxw-400">
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
          <input
            v-model="search"
            @keyup="list()"
            type="text"
            class="form-control"
            placeholder="Buscar"
          />
        </div>
      </div>
      <div class="col-4 col-md-2 col-xl-1 ps-md-0 text-end">
        <div class="dropdown">
          <button
            class="
              btn btn-link
              text-dark
              dropdown-toggle dropdown-toggle-split
              m-0
              p-1
            "
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="fas fa-cog" style="font-size: 30px"></i>
          </button>
          <div class="dropdown-menu dropdown-menu-xs dropdown-menu-end pb-0">
            <span class="small ps-3 fw-bold text-dark">Ver</span>
            <a class="dropdown-item fw-bold" @click="views(10)">10</a>
            <a class="dropdown-item fw-bold" @click="views(15)">15</a>
            <a class="dropdown-item fw-bold" @click="views(20)">20</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card card-body border-0 shadow table-wrapper table-responsive">
    <div v-if="!informers" class="d-flex justify-content-center">
      <div class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div
      v-if="total == 0"
      class="alert alert-warning d-flex justify-content-center"
      role="alert"
    >
      <span class="text-danger">Registro no encontrado</span>
    </div>

    <table class="table table-hover" v-if="total > 0">
      <thead class="thead-light">
        <tr>
          <th class="border-gray-200">ID</th>
          <th class="border-gray-200">NOMBRE</th>
          <th class="border-gray-200">EMAIL</th>
          <th class="border-gray-200">TÉLEFONO</th>
          <th class="border-gray-200">FECHA REGISTRO</th>
          <th class="border-gray-200">NÚMERO DENUNCIAS</th>
          <th class="border-gray-200">ACIONES</th>
        </tr>
      </thead>
      <tbody>
        <!-- Item -->
        <tr v-for="informer in this.informers" :key="informer">
          <td>
            <a href="#" class="fw-bold">{{ informer.id }}</a>
          </td>
          <td>
            <span class="fw-normal">{{ informer.name }}</span>
          </td>
          <td>
            <span class="fw-normal">{{ informer.email }}</span>
          </td>
          <td>
            <span class="fw-normal">{{ informer.phone }}</span>
          </td>
          <td>
            <span class="fw-bold">{{ formatDate(informer.created_at) }}</span>
          </td>
          <td>
            <span class="badge bg-info" v-if="informer.complaint_count > 0">
              {{ informer.complaint_count }}
            </span>
            <span class="badge bg-danger" v-else>
              {{ informer.complaint_count }}
            </span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="
                  btn btn-link
                  text-dark
                  dropdown-toggle dropdown-toggle-split
                  m-0
                  p-0
                "
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="icon icon-sm">
                  <span class="fas fa-ellipsis-h icon-dark"></span>
                </span>
                <span class="visually-hidden">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu py-0">
                <a class="dropdown-item rounded-top" href="#"
                  ><span class="fas fa-eye me-2"></span>View Details</a
                >
                <a class="dropdown-item" href="#"
                  ><span class="fas fa-edit me-2"></span>Edit</a
                >
                <a class="dropdown-item text-danger rounded-bottom" href="#"
                  ><span class="fas fa-trash-alt me-2"></span>Remove</a
                >
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="
        card-footer
        px-3
        border-0
        d-flex
        flex-column flex-lg-row
        align-items-center
        justify-content-between
      "
    >
      <nav aria-label="Page navigation example" v-if="total > 0">
        <ul class="pagination mb-0 pagination-sm">
          <li class="page-item" v-for="link in links" :key="link">
            <a
              class="page-link"
              @click="next(link.label)"
              :class="{ active: link.active == true }"
              >{{ link.label }}</a
            >
          </li>
        </ul>
      </nav>
      <div class="fw-normal small mt-4 mt-lg-0" v-if="total > 0">
        viendo <b>{{ limitPage }}</b> de <b>{{ total }}</b>
      </div>
    </div>
  </div>
  <!-- Modal asignar funcionario -->
  <div
    ref="my-modal"
    class="modal fade"
    id="registerUser"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="registerUser"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog modal-lg">
      <div class="modal-content">
        <form v-on:submit.prevent="storeOficcial()">
          <div class="modal-header">
            <h5 class="modal-title" id="registerUser">Registrar funcionario</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <div class="row">
                <div class="col-sm-5 col-md-6">
                  <label class="form-label">Rol:</label>
                  <select class="form-control" v-model="rol" required>
                    <option v-for="rol in rols" :key="rol" :value="rol.id">
                      {{ rol.name }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-5 col-md-6">
                  <label class="form-label">Tipo de persona:</label>
                  <select class="form-control" v-model="typePeople" required>
                    <option
                      v-for="type in typePeoples"
                      :key="type"
                      :value="type.id"
                    >
                      {{ type.name }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-5 col-md-6">
                  <label class="form-label">Profesión:</label>
                  <select class="form-control" v-model="profession" required>
                    <option
                      v-for="profession in professions"
                      :key="profession"
                      :value="profession.id"
                    >
                      {{ profession.name }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                  <label class="form-label">Tipo de documento:</label>
                  <select class="form-control" v-model="typeDocument" required>
                    <option
                      v-for="type in typeDocuments"
                      :key="type"
                      :value="type.id"
                    >
                      {{ type.name }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                  <label class="form-label">Número de documento:</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="document"
                    required
                  />
                </div>
                <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                  <label class="form-label">Nombres:</label>
                  <input type="text" class="form-control" v-model="name" required/>
                </div>
                <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                  <label class="form-label">Apellidos:</label>
                  <input type="text" class="form-control" v-model="last_name" required/>
                </div>
                <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                  <label class="form-label">Email:</label>
                  <input type="email" class="form-control" v-model="email" required/>
                </div>
                <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                  <label class="form-label">Télefono:</label>
                  <input type="text" class="form-control" v-model="phone" required/>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <div>
              <button
                type="submit"
                class="btn btn-info"
              >
                Registrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Officials",
  data() {
    return {
      informers: null,
      urlApi: process.env.VUE_APP_URL_API,
      token: localStorage.getItem("token"),
      limitPage: 10,
      links: [],
      page: 1,
      search: "",
      total: null,
      typePeoples: null,
      typeDocuments: null,
      rols: null,
      professions: null,
      rol: null,
      typePeople: null,
      profession: null,
      typeDocument: null,
      document: null,
      name: null,
      last_name: null,
      email: null,
      phone: null,
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    formatDate(value) {
      moment.locale("es");
      if (value) {
        return moment(String(value)).format("LL");
      }
    },
    async list(limit = null, page = null) {
      if (limit) {
        this.limitPage = limit;
      }
      if (page) {
        this.page = page;
      }
      let res = await axios.get(
        this.urlApi +
          "list-users-official?search=" +
          this.search +
          "&limit=" +
          this.limitPage +
          "&page=" +
          this.page,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      this.informers = res.data.data.data;
      this.links = res.data.data.links.slice(1, res.data.data.links.length - 1);
      this.total = res.data.data.total;
    },
    next(num) {
      this.list(this.limit, num);
    },
    views(num) {
      this.limitPage = num;
      this.list(this.limit, this.page);
    },
    async getTypePeople() {
      const res = await axios.get(this.urlApi + "list-type-peoples");
      this.typePeoples = res.data.data;
    },
    async getTypeDocument() {
      const res = await axios.get(this.urlApi + "list-type-documents");
      this.typeDocuments = res.data.data;
    },
    async getRols() {
      const res = await axios.get(this.urlApi + "rols-active");
      this.rols = res.data.data;
    },
    async getProfessions() {
      const res = await axios.get(this.urlApi + "professions-active");
      this.professions = res.data.data;
    },
    async storeOficcial() {
      const content = new Object();
      content.type_people = this.typePeople;
      content.type_document = this.typeDocument;
      content.document = this.document;
      content.name = this.name;
      content.last_name = this.last_name;
      content.email = this.email;
      content.phone = this.phone;
      content.profession = this.profession;
      content.rol = this.rol;
      try {
        const res = await axios.post(
          this.urlApi + "register-official",
          content,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        this.noty(res.data.message, "info");
        window.$("#registerUser").modal("hide");
        this.list();
      } catch (error) {
        this.noty(error.response.data.email, "error");
        //console.log(error.response.data.email);
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
<style>
.active {
  background-color: rgb(11, 4, 51);
  color: aliceblue;
}
</style>
