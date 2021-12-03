<template>
  <time-line :title="title" :states="states" />
  <div class="card card-body border-0 shadow">
    <div class="card-body">
      <div class="row g-0">
        <div class="col-8 col-sm-8 col-md-3">
          <p>Denunciante:</p>
          <p class="h5" v-if="informer">{{ informer }}</p>
          <span class="badge bg-danger" v-else> ANÓNIMO </span>
          <p>Dirección:</p>
          {{addres}}
        </div>
        <div class="col-8 col-sm-8 col-md-3">
          <p>Motivo:</p>
          <p class="h5">{{ type_complaint }}</p>
        </div>
        <div class="col-8 col-sm-8 col-md-3">
          <p>Estado actual:</p>
          <span class="badge bg-success" v-if="state == 'INICIADA'">
            {{ state }}
          </span>
          <span class="badge bg-info" v-else-if="state == 'EN PROCESO'">
            {{ state }}
          </span>
          <span class="badge bg-danger" v-else>
            {{ state }}
          </span>
        </div>
        <div class="col-8 col-sm-8 col-md-3">
          <select class="form-select" style="width: 250px">
            <option selected="selected">Asignar funcionario</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="overflow-hidden" id="description">
    <div class="row gx-4">
      <div class="col-12 col-sm-12 col-md-6 mt-2">
        <div class="p-3 card border bg-light" style="height: auto">
          <p>Descripción:</p>
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
</template>
<script>
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import VuePictureSwipe from "vue-picture-swipe";
import Timeline from "../components/Timeline.vue";
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
      addres:null,
      media: [],
      video: null,
      states: null,
      title: null,
      longitude: null,
      latitude: null,
      indice: null,
    };
  },
  mounted() {
    this.getComplaint(this.$route.params.id);
  },
  methods: {
    async getComplaint(id) {
      const res = await axios.get(this.urlApi + "complaints/" + id, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.informer = res.data.data.informer;
      this.state = res.data.data.state;
      this.type_complaint = res.data.data.type_complaint;
      this.description = res.data.data.description;
      this.addres = res.data.data.address;
      this.title = "Denuncia: " + res.data.data.cod;
      this.states = res.data.data.response_complaint;
      this.latitude = res.data.data.latitude;
      this.longitude = res.data.data.longitude;
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
    setupLeafletMap: function (lon, latitude) {
      var map = L.map("map").setView([latitude, lon], 14);
      L.tileLayer(
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
</style>