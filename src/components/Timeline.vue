<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title mb-5">{{ title }}</h4>

      <div class="hori-timeline" dir="ltr">
        <ul class="list-inline events">
          <li
            class="list-inline-item event-list"
            v-for="state in states"
            :key="state"
          >
            <div class="px-4">
              <div
                class="event-date bg-soft-success text-success"
                v-if="state.id_state_complaint == 1"
              >
                INICIADA
              </div>
              <div
                class="event-date bg-soft-primary text-primary"
                v-else-if="state.id_state_complaint == 2"
              >
                EN PROCESO
              </div>
              <div class="event-date bg-soft-danger text-gander" v-else>
                FINALIZADA
              </div>
              <h5 class="font-size-16">{{ formatDate(state.created_at) }}</h5>
              <p class="text-muted description">
                {{ state.description }}
              </p>
              <div>
                <a
                  v-if="state.id_state_complaint == 1"
                  href="#description"
                  class="btn btn-success text-white btn-sm p-1"
                  >Detalle</a
                >
                <a
                  @click="getDetail(state.id, state.description)"
                  v-else
                  href="#description"
                  class="btn btn-success text-white btn-sm p-1"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  >Detalle</a
                >
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
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
          <h5 class="modal-title" id="staticBackdropLabel">{{ title }}</h5>
          <button
            @click="resetData()"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>Descripcion:</h5>
          <br />
          <p>{{ detail }}</p>
          <hr />
          <h5>Evidencias:</h5>
          <vue-picture-swipe :items="media"></vue-picture-swipe>
        </div>
        <div class="modal-footer">
          <button
            @click="resetData()"
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import axios from "axios";
import VuePictureSwipe from "vue-picture-swipe";
export default {
  name: "TimeLine",
  props: {
    title: String,
    states: Array,
  },
  components: {
    "vue-picture-swipe": VuePictureSwipe,
  },
  data() {
    return {
      detail: null,
      media: [],
      urlApi: process.env.VUE_APP_URL_API,
    };
  },
  methods: {
    formatDate(value) {
      moment.locale("es");
      if (value) {
        return moment(String(value)).format("LL");
      }
    },
    async getDetail(id, detail) {
      const res = await axios.get(this.urlApi + "media-by-response/" + id);
      this.detail = detail;
      res.data.data.forEach((element) =>
        this.media.push({
          src: element.url,
          thumbnail: element.url,
          w: 600,
          h: 400,
        })
      );
    },
    resetData() {
      this.media = [];
      this.detail = null;
    },
  },
};
</script>
<style>
.hori-timeline .events {
  border-top: 3px solid #e9ecef;
  text-align: center;
}
.hori-timeline .events .event-list {
  display: block;
  position: relative;
  text-align: center;
  padding-top: 70px;
  margin-right: 0;
}
.hori-timeline .events .event-list:before {
  content: "";
  position: absolute;
  height: 36px;
  border-right: 2px dashed #dee2e6;
  top: 0;
}
.hori-timeline .events .event-list .event-date {
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  width: 150px;
  margin: 0 auto;
  border-radius: 4px;
  padding: 2px 4px;
}
@media (min-width: 1140px) {
  .hori-timeline .events .event-list {
    display: inline-block;
    width: 24%;
    padding-top: 45px;
  }
  .hori-timeline .events .event-list .event-date {
    top: -12px;
  }
}
.bg-soft-primary {
  background-color: rgba(64, 144, 203, 0.3) !important;
}
.bg-soft-success {
  background-color: rgba(71, 189, 154, 0.3) !important;
}
.bg-soft-danger {
  background-color: rgba(231, 76, 94, 0.3) !important;
}
.bg-soft-warning {
  background-color: rgba(249, 213, 112, 0.3) !important;
}
.card {
  border: none;
  margin-bottom: 24px;
  -webkit-box-shadow: 0 0 13px 0 rgba(236, 236, 241, 0.44);
  box-shadow: 0 0 13px 0 rgba(236, 236, 241, 0.44);
}
.description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>