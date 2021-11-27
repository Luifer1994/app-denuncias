<template>
  <h1>Denunciantes</h1>
  {{this.informers}}
</template>
<script>
import axios from "axios";
/* import moment from "moment"; */
export default {
  name: "Informers",
  data() {
    return {
      informers: Object,
      urlApi: process.env.VUE_APP_URL_API,
      token: localStorage.getItem("token")
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    async list() {
      let res = await axios.get(this.urlApi+"list-users-informers", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.informers = res.data.data.data;
      console.log(this.informers);
    },
  },
};
</script>