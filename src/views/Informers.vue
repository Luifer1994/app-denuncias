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
          <input type="text" class="form-control" placeholder="Buscar" />
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
            <i class="fas fa-cog"></i>
          </button>
          <div class="dropdown-menu dropdown-menu-xs dropdown-menu-end pb-0">
            <span class="small ps-3 fw-bold text-dark">Show</span>
            <a class="dropdown-item d-flex align-items-center fw-bold" href="#">
              10
            </a>
            <a class="dropdown-item fw-bold" href="#">20</a>
            <a class="dropdown-item fw-bold rounded-bottom" href="#">30</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card card-body border-0 shadow table-wrapper table-responsive">
    <table class="table table-hover">
      <thead>
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
      <nav aria-label="Page navigation example">
        <ul class="pagination mb-0">
          <li class="page-item">
            <a class="page-link" href="#">Previous</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">1</a>
          </li>
          <li class="page-item active">
            <a class="page-link" href="#">2</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">3</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">4</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">5</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
      <div class="fw-normal small mt-4 mt-lg-0">
        Showing <b>5</b> out of <b>25</b> entries
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
      informers: Object,
      urlApi: process.env.VUE_APP_URL_API,
      token: localStorage.getItem("token"),
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
    async list() {
      let res = await axios.get(this.urlApi + "list-users-informers", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.informers = res.data.data.data;
      console.log(res.data.data);
    },
  },
};
</script>