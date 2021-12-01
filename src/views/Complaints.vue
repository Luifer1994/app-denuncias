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
      <h2 class="h4">Denuncias</h2>
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
      <div class="col-6 col-md-6 col-lg-3 col-xl-4">
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
      <div class="col-2 col-md-2 col-xl-1 ps-md-0 text-end">
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
            <b v-if="!state">Estado</b>
            <b v-else-if="state == 1">INICIADA</b>
            <b v-else-if="state == 2">EN PROCESO</b>
            <b v-else>FINALIZADA</b>
            <i class="fas fa-filter"></i>
          </button>
          <div class="dropdown-menu dropdown-menu-xs dropdown-menu-end pb-0">
            <a class="dropdown-item fw-bold text-danger" @click="resetFilter()"
              >Limpiar <i class="fas fa-power-off"></i
            ></a>
            <a class="dropdown-item fw-bold" @click="filterState(1)"
              >INICIADA</a
            >
            <a class="dropdown-item fw-bold" @click="filterState(2)"
              >EN PROCESO</a
            >
            <a class="dropdown-item fw-bold" @click="filterState(4)"
              >FINALIZADA</a
            >
          </div>
        </div>
      </div>
      <div class="col-2 col-md-2 col-xl-6 ps-md-0 text-end">
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

  <div class="card card-body border-0 shadow table-wrapper">
    <div v-if="!complaints" class="d-flex justify-content-center">
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
    <div class="table-responsive">
      <table class="table table-hover table-centered table-nowrap mb-0 rounded">
        <thead class="thead-light" v-if="total > 0">
          <tr>
            <th class="border-gray-200">ID</th>
            <th class="border-gray-200">TIPO DENUNCIA</th>
            <th class="border-gray-200">DENUNCIANTE</th>
            <th class="border-gray-200">INFRACTOR</th>
            <th class="border-gray-200">FECHA REGISTRO</th>
            <th class="border-gray-200">ESTADO</th>
            <th class="border-gray-200">ACIONES</th>
          </tr>
        </thead>
        <tbody>
          <!-- Item -->
          <tr v-for="complaint in this.complaints" :key="complaint">
            <td>
              <a href="#" class="fw-bold">{{ complaint.cod }}</a>
            </td>
            <td>
              <span class="fw-normal">{{ complaint.type_complaint }}</span>
            </td>
            <td>
              <span class="fw-normal" v-if="complaint.informer">{{
                complaint.informer
              }}</span>
              <span v-else class="badge bg-danger"> Anónimo </span>
            </td>
            <td>
              <span class="fw-normal">{{ complaint.name_offender }}</span>
            </td>
            <td>
              <span class="fw-bold">{{
                formatDate(complaint.created_at)
              }}</span>
            </td>
            <td>
              <span
                class="badge bg-success"
                v-if="complaint.state == 'INICIADA'"
              >
                {{ complaint.state }}
              </span>
              <span
                class="badge bg-info"
                v-else-if="complaint.state == 'EN PROCESO'"
              >
                {{ complaint.state }}
              </span>
              <span class="badge bg-danger" v-else>
                {{ complaint.state }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-info p-1"
                title="Detalle"
                @click="detailComplaint(complaint.id)"
              >
                <i class="fas fa-plus-circle"></i>
              </button>
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
          <ul class="pagination pagination-sm">
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
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Complaints",
  data() {
    return {
      complaints: null,
      urlApi: process.env.VUE_APP_URL_API,
      token: localStorage.getItem("token"),
      limitPage: 10,
      links: [],
      page: 1,
      search: "",
      total: null,
      state: "",
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    async list(limit = null, page = null, state = "") {
      if (limit) {
        this.limitPage = limit;
      }
      if (page) {
        this.page = page;
      }
      if (state) {
        this.state = state;
      }
      let res = await axios.get(
        this.urlApi +
          "complaints-list?search=" +
          this.search +
          "&state=" +
          this.state +
          "&limit=" +
          this.limitPage +
          "&page=" +
          this.page,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      this.complaints = res.data.data.data;
      this.links = res.data.data.links.slice(1, res.data.data.links.length - 1);
      this.total = res.data.data.total;
    },
    filterState(state) {
      this.list(this.limit, (this.page = 1), state);
    },
    resetFilter() {
      this.list(this.limit, (this.page = 1), (this.state = ""));
    },
    next(num) {
      this.list(this.limit, num, this.state);
    },
    views(num) {
      this.limitPage = num;
      this.list(this.limit, this.page, this.state);
    },
    formatDate(value) {
      moment.locale("es");
      if (value) {
        return moment(String(value)).format("LL");
      }
    },
    detailComplaint(id) {
      this.$router.push({ path: "/complaint/" + id });
    },
  },
};
</script>
<style>
.active {
  background-color: rgb(11, 4, 51);
  color: aliceblue;
}
.danger {
  color: rgb(250, 99, 99);
}
.info {
  color: rgb(0, 132, 255);
}
.success {
  color: rgb(25, 207, 65);
}
.warning {
  color: rgb(253, 228, 0);
}
</style>