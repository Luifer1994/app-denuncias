<template>
  <div class="">
    <nav
      class="navbar navbar-top navbar-expand navbar-dashboard navbar-dark ps-0 pe-2 pb-0"
    >
      <div class="container-fluid px-0">
        <div class="d-flex justify-content-between w-100" id="navbarSupportedContent">
          <div class="d-flex align-items-center"></div>
          <!-- Navbar links -->
          <ul class="navbar-nav align-items-center">
            <li class="nav-item dropdown ms-lg-3">
              <a
                class="nav-link dropdown-toggle pt-1 px-0"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div class="media d-flex align-items-center">
                  <img
                    class="avatar rounded-circle"
                    alt="Image placeholder"
                    src="https://www.shareicon.net/data/2016/05/26/771188_man_512x512.png"
                  />
                  <div
                    class="media-body ms-2 text-dark align-items-center d-none d-lg-block"
                  >
                    <span class="mb-0 font-small fw-bold text-gray-900">{{
                      this.$store.state.user.name
                    }}</span>
                  </div>
                </div>
              </a>
              <div class="dropdown-menu dashboard-dropdown dropdown-menu-end mt-2 py-1">
                <router-link
                  to="/perfil"
                  class="dropdown-item d-flex align-items-center"
                  href="#"
                >
                  <i class="fas fa-user m-2"></i>
                  My Perfil
                </router-link>
                <div role="separator" class="dropdown-divider my-1"></div>
                <a @click="logout" class="dropdown-item d-flex align-items-center">
                  <i class="fas fa-sign-out-alt text-danger m-2"></i>
                  Cerrar sesión
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  name: "Navbar",

  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>
