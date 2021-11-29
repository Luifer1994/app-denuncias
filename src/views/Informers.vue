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
      <h2 class="h4">Denunciantes</h2>
    </div>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group ms-2 ms-lg-3">
        <button type="button" class="btn btn-sm btn-outline-gray-600">
          Exportar
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
      <div
        class="spinner-border text-success"
        role="status"
        style="width: 100px; height: 100px"
      >
        <span class="visually-hidden">Loading...</span>
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
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Informers",
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
      console.log(this.$store.state.user);
      if (limit) {
        this.limitPage = limit;
      }
      if (page) {
        this.page = page;
      }
      let res = await axios.get(
        this.urlApi +
          "list-users-informers?search=" +
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
  },
};
</script>
<style>
.active {
  background-color: rgb(11, 4, 51);
  color: aliceblue;
}
</style>
