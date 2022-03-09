<template>
  <time-line v-if="states" :title="title" :states="states" />
  <div class="card card-body border-0 shadow">
    <div class="card-body">
      <div class="row g-0">
        <div class="col-8 col-sm-8 col-md-3">
          <p>Denunciante:</p>
          <p class="h5" v-if="informer">{{ informer }}</p>
          <span class="badge bg-danger" v-else> ANÓNIMO </span>
          <p>Dirección:</p>
          {{ addres }}
        </div>
        <div class="col-8 col-sm-8 col-md-2">
          <p>Infracción:</p>
          <p class="h5">{{ type_complaint }}</p>
        </div>
        <div class="col-8 col-sm-8 col-md-3">
          <p>Funcionario Asignado:</p>
          <div v-if="!user_asigne">
            <span class="badge bg-danger"> SIN ASIGNACIÓN </span>
          </div>
          <div v-else>
            <h5>{{ name_user_asigne }}</h5>
            <p>{{ email_user_asigne }}</p>
          </div>
        </div>
        <div class="col-8 col-sm-8 col-md-2">
          <p>Estado actual:</p>
          <span class="badge bg-success" v-if="state == 'INICIADA'">
            {{ state }}
          </span>
          <span class="badge bg-info" v-else-if="state == 'EN PROCESO'">
            {{ state }}
          </span>
          <div v-else-if="state == 'INDAGACIÓN'">
            <span class="badge bg-soft-warning">
              {{ state }}
            </span>
            <p>Abogado asignado:</p>
            <b>{{ lawyer }}</b>
          </div>
          <div v-else-if="state == 'NOTIFICACIÓN'">
            <span class="badge bg-soft-success">
              {{ state }}
            </span>
            <p>Funcionario asignado:</p>
            <b>{{ name_user_asigne }}</b>
          </div>

          <span class="badge bg-danger" v-else>
            {{ state }}
          </span>
        </div>
        <div v-if="state !== 'CANCELADA'" class="col-8 col-sm-8 col-md-2">
          <p>Acciones:</p>
          <button
            v-if="user_asigne"
            @click="getOfficials()"
            data-bs-toggle="modal"
            data-bs-target="#asigneUser"
            class="btn btn-info"
          >
            Agregar respuesta
          </button>
          <button
            v-if="state == 'EN PROCESO' && this.$store.state.user.id_rol === 1"
            @click="getLawyer()"
            data-bs-toggle="modal"
            data-bs-target="#asigneUser"
            class="btn btn-warning mt-2"
          >
            Llevar a Indagación
          </button>

          <button
            v-if="!user_asigne && this.$store.state.user.id_rol === 1"
            @click="getOfficials()"
            data-bs-toggle="modal"
            data-bs-target="#asigneUser"
            class="btn btn-danger mt-2"
          >
            Asignar funcionario
          </button>
          <button
            v-if="state !== 'INICIADA' && this.$store.state.user.id_rol === 1"
            @click="getOfficials(), reasingUser()"
            data-bs-toggle="modal"
            data-bs-target="#asigneUser"
            class="btn btn-primary mt-2"
          >
            Reasignar funcionario
          </button>

          <button
            v-if="state == 'INDAGACIÓN' && this.$store.state.user.id_rol === 1"
            @click="getOfficials()"
            data-bs-toggle="modal"
            data-bs-target="#asigneUser"
            class="btn btn-success mt-2"
          >
            Notificacón
          </button>
          <button
            v-if="
              state !== 'FINALIZADA' &&
              state !== 'INICIADA' &&
              this.$store.state.user.id_rol === 1
            "
            @click="closing()"
            data-bs-toggle="modal"
            data-bs-target="#asigneUser"
            class="btn btn-danger mt-2"
          >
            Cerrar Denuncia
          </button>

          <button
            v-if="this.$store.state.user.id_rol === 1"
            @click="canceln()"
            data-bs-toggle="modal"
            data-bs-target="#asigneUser"
            class="btn btn-danger mt-2"
          >
            Cancelar denuncia
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="overflow-hidden" id="description">
    <div class="row gx-4">
      <div class="col-12 col-sm-12 col-md-6 mt-2">
        <div class="p-3 card border bg-light" style="height: auto">
          <p>Motivo:</p>
          <p class="h5">{{ description }}</p>
          <hr />
          <p>Evidencias:</p>
          <vue-picture-swipe :items="media"></vue-picture-swipe>
          <p>Video de denuncia:</p>
          <div class="" v-if="video">
            <video width="320" height="240" controls>
              <source :src="video.url" :type="video.type" />
            </video>
          </div>
        </div>
      </div>
      <div class="col mt-2">
        <div
          class="p-3 card border bg-light"
          id="map"
          style="height: 400px"
        ></div>
      </div>
    </div>
  </div>

  <!-- Modal asignar funcionario -->
  <div
    ref="my-modal"
    class="modal fade"
    id="asigneUser"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="asigneUser"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-if="canceling">Cancelar</h5>
          <h5 class="modal-title" v-else-if="reasing" id="asigneUser">
            Reasignar funcionario
          </h5>

          <h5 class="modal-title" v-else-if="!user_asigne" id="asigneUser">
            Asignar funcionario
          </h5>
          <h5 class="modal-title" v-else-if="inquiry">Asignar indagación</h5>
          <h5 class="modal-title" v-else-if="closed">Cerrar Denuncia</h5>
          <h5
            class="modal-title"
            v-else-if="
              state == 'INDAGACIÓN' && this.$store.state.user.id_rol === 1
            "
          >
            Notificar
          </h5>

          <h5 class="modal-title" v-else id="asigneUser">Responder</h5>
          <button
            @click="resetData()"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="!canceling">
            <div
              class="mb-3"
              v-if="
                !user_asigne ||
                reasing ||
                (state == 'INDAGACIÓN' && this.$store.state.user.id_rol === 1)
              "
            >
              <label for="exampleFormControlInput1" class="form-label"
                >Seleccione el funcionario:</label
              >
              <select v-model="id_user_asine" class="form-select">
                <option
                  v-for="official in officials"
                  :key="official"
                  :value="official.id"
                >
                  {{ official.name }} {{ official.last_name }}
                </option>
              </select>
            </div>
            <div class="mb-3" v-if="inquiry">
              <label for="exampleFormControlInput1" class="form-label"
                >Seleccionar abogado:</label
              >
              <select v-model="id_lawyer" class="form-select">
                <option
                  v-for="lawyer in lawyers"
                  :key="lawyer"
                  :value="lawyer.id"
                >
                  {{ lawyer.name }} {{ lawyer.last_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Agregar detalles:</label>
            <textarea v-model="detail" class="form-control" rows="5"></textarea>
          </div>
          <div class="d-flex justify-content-center" v-if="uploadResponse">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div
            class="mb-3"
            v-if="state !== 'INICIADA' && !inquiry && !canceling && !reasing"
          >
            <div class="d-flex justify-content-center">
              <div>
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  class="uploading-image"
                />
                <img
                  v-if="previewPDF"
                  class="uploading-image"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                />
              </div>
            </div>
            <br />
            <input
              class="form-control"
              type="file"
              accept="application/pdf, image/*"
              @change="uploadImage"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="resetData()"
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <div v-if="canceling">
            <button @click="cancel()" type="button" class="btn btn-info">
              Continuar
            </button>
          </div>
          <div v-else-if="!user_asigne || reasing">
            <button @click="asigneUser()" type="button" class="btn btn-info">
              Asignar
            </button>
          </div>

          <div v-else-if="inquiry">
            <button @click="asigneLawyer()" type="button" class="btn btn-info">
              Asignar
            </button>
          </div>
          <div
            v-else-if="
              state == 'INDAGACIÓN' && this.$store.state.user.id_rol === 1
            "
          >
            <button @click="asigneNotify()" type="button" class="btn btn-info">
              Notificar
            </button>
          </div>
          <div v-else-if="closed">
            <button
              @click="closedComplaint()"
              type="button"
              class="btn btn-info"
              v-if="!uploadResponse"
            >
              Guardar
            </button>
            <button type="button" class="btn btn-info" v-else disabled>
              Guardar
            </button>
          </div>
          <div v-else>
            <button
              @click="storeResponse()"
              type="button"
              class="btn btn-info"
              v-if="!uploadResponse"
            >
              Guardar
            </button>
            <button
              v-else
              @click="storeResponse()"
              type="button"
              class="btn btn-info"
              disabled
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import VuePictureSwipe from "vue-picture-swipe";
import Timeline from "../components/Timeline.vue";
import { UploadFile } from "../utils/firebase";
export default {
  name: "DetailComplaint",
  components: {
    "vue-picture-swipe": VuePictureSwipe,
    "time-line": Timeline,
  },
  data() {
    return {
      complaint: null,
      urlApi: process.env.VUE_APP_URL_API,
      token: localStorage.getItem("token"),
      informer: null,
      state: null,
      type_complaint: null,
      description: null,
      addres: null,
      media: [],
      video: null,
      states: null,
      title: null,
      longitude: null,
      latitude: null,
      indice: null,
      user_asigne: null,
      officials: null,
      id_user_asine: null,
      detail: null,
      media_response: null,
      previewImage: null,
      previewPDF: false,
      name_user_asigne: null,
      email_user_asigne: null,
      fileResponse: null,
      uploadResponse: false,
      lawyers: null,
      inquiry: false,
      id_lawyer: null,
      name_lawyer: null,
      closed: false,
      canceling: false,
      reasing: false,
    };
  },
  mounted() {
    this.getComplaint(this.$route.params.id);
  },
  methods: {
    canceln() {
      this.canceling = true;
    },
    reasingUser() {
      this.reasing = true;
    },

    async getComplaint(id) {
      const res = await axios.get(this.urlApi + "complaints/" + id, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      this.lawyer =
        res.data.data.name_user_inquest +
        " " +
        res.data.data.last_name_user_inquest;
      this.informer = res.data.data.informer;
      this.state = res.data.data.state;
      this.type_complaint = res.data.data.type_complaint;
      this.description = res.data.data.description;
      this.addres = res.data.data.address;
      this.title = "Denuncia: " + res.data.data.cod;
      this.states = res.data.data.response_complaint;
      this.latitude = res.data.data.latitude;
      this.longitude = res.data.data.longitude;
      this.user_asigne = res.data.data.id_user_asigne;
      if (this.user_asigne) {
        this.getUserAsigne(this.user_asigne);
      }
      res.data.data.media.forEach((element) => {
        if (element.type.includes("image")) {
          this.media.push({
            src: element.url,
            thumbnail: element.url,
            w: 600,
            h: 400,
          });
        } else if (element.type.includes("video")) {
          this.video = element;
        }
      });
      this.setupLeafletMap(this.longitude, this.latitude);
    },
    async setupLeafletMap(lon, latitude) {
      var map = L.map("map").setView([latitude, lon], 14);
      await L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoibHVpZmVyMTk5NCIsImEiOiJja3dtZXUyNnEwYjB2MnZwamJwY2dmZXJtIn0.NGI4P7jXpJoTD7yyJm8NIw",
        }
      ).addTo(map);
      const iconUrl =
        "https://img.icons8.com/external-kmg-design-flat-kmg-design/50/000000/external-map-map-and-navigation-kmg-design-flat-kmg-design.png";
      let iconMarker = L.icon({
        iconUrl: iconUrl,
        iconSize: [60, 60],
        iconAnchor: [60, 60],
      });
      L.marker([latitude, lon], { icon: iconMarker }).addTo(map);
    },
    async getOfficials() {
      const res = await axios.get(this.urlApi + "list-official", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.officials = res.data.data;
    },
    async getLawyer() {
      this.inquiry = true;
      const res = await axios.get(this.urlApi + "list-users-lawyer", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.lawyers = res.data.data;
      console.log(this.lawyers);
    },
    async uploadImage(e) {
      this.uploadResponse = true;
      const file = e.target.files[0];
      const res = await UploadFile(file);
      this.fileResponse = new Object();
      this.fileResponse.type = file.type;
      this.fileResponse.url = res;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.includes("image")) {
        reader.onload = (e) => {
          this.previewImage = e.target.result;
          this.previewPDF = false;
        };
      } else {
        this.previewPDF = true;
        this.previewImage = null;
      }
      this.uploadResponse = false;
    },
    async asigneUser() {
      var content = new Object();
      content.user_asigne = this.id_user_asine;
      content.description = this.detail;
      content.media_response = this.media_response;
      if (!this.id_user_asine) {
        this.message = "Selecciona un funcionario";
        this.typeMessage = "error";
        this.noty(this.message, this.typeMessage);
      } else {
        const res = await axios.put(
          this.urlApi + "complaints/" + this.$route.params.id,
          content,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.noty(res.data.message, "info");
        window.$("#asigneUser").modal("hide");
        var container = L.DomUtil.get("map");
        if (container != null) {
          container._leaflet_id = null;
        }
        this.$router.go();
      }
    },
    async asigneLawyer() {
      var content = new Object();
      content.lawyer = this.id_lawyer;
      content.description = this.detail;
      if (!this.id_lawyer) {
        this.message = "Selecciona un abogado";
        this.typeMessage = "error";
        this.noty(this.message, this.typeMessage);
      } else {
        const res = await axios.put(
          this.urlApi + "asigne-lawyer/" + this.$route.params.id,
          content,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.noty(res.data.message, "info");
        window.$("#asigneUser").modal("hide");
        this.$router.go();
        this.inquiry = false;
      }
    },

    async asigneNotify() {
      var content = new Object();
      content.user_asigne = this.id_user_asine;
      content.description = this.detail;
      if (!this.id_user_asine) {
        this.message = "Selecciona un funcionario";
        this.typeMessage = "error";
        this.noty(this.message, this.typeMessage);
      } else {
        const res = await axios.put(
          this.urlApi + "asigne-notify/" + this.$route.params.id,
          content,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.noty(res.data.message, "info");
        window.$("#asigneUser").modal("hide");
        this.$router.go();
        this.inquiry = false;
      }
    },
    async closedComplaint() {
      var content = new Object();
      content.description = this.detail;
      if (this.fileResponse) {
        content.media_response = [this.fileResponse];
      }
      const res = await axios.put(
        this.urlApi + "complaint-closed/" + this.$route.params.id,
        content,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      this.noty(res.data.message, "info");
      window.$("#asigneUser").modal("hide");
      this.$router.go();
      this.closed = false;
    },
    async cancel() {
      var content = new Object();
      content.description = this.detail;
      if (this.fileResponse) {
        content.media_response = [this.fileResponse];
      }
      const res = await axios.put(
        this.urlApi + "complaint-cancel/" + this.$route.params.id,
        content,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      this.noty(res.data.message, "info");
      window.$("#asigneUser").modal("hide");
      this.$router.go();
      this.canceling = false;
    },
    closing() {
      this.closed = true;
    },
    async getUserAsigne(id) {
      const res = await axios.get(this.urlApi + "filter-user-by-id/" + id, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.email_user_asigne = res.data.data.email;
      this.name_user_asigne = res.data.data.name;
    },
    async storeResponse() {
      var content = new Object();
      content.description = this.detail;
      if (this.fileResponse) {
        content.media_response = [this.fileResponse];
      }
      const res = await axios.put(
        this.urlApi + "complaint-update-proccess/" + this.$route.params.id,
        content,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      this.noty(res.data.message, "info");
      window.$("#asigneUser").modal("hide");
      this.detail = null;
      this.fileResponse = null;
      this.$router.go();
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
    resetData() {
      this.inquiry = false;
      this.closed = false;
      this.canceling = false;
      this.reasing = false;
    },
  },
};
</script>
<style>
.my-gallery figure img {
  width: 140px;
  height: 140px;
  border-radius: 5%;
  margin: 2px;
}
.uploading-image {
  display: flex;
  width: 130px;
  height: 150px;
}
.disable {
  cursor: not-allowed;
  background-color: rgb(229, 229, 229) !important;
  pointer-events: none;
}
.bg-soft-warning {
  background-color: rgb(249, 212, 112) !important;
  color: rgb(58, 58, 58);
}
.bg-soft-success {
  background-color: rgb(109, 255, 128);
  color: rgb(58, 58, 58);
}
</style>