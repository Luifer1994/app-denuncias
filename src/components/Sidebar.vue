<template>
  <div class="">
    <nav
      id="sidebarMenu"
      class="sidebar d-lg-block bg-gray-800 text-white collapse"
      data-simplebar
    >
      <div class="sidebar-inner px-4 pt-3">
        <div
          class="
            user-card
            d-flex d-md-none
            align-items-center
            justify-content-between justify-content-md-center
            pb-4
          "
        >
          <div class="d-flex align-items-center">
            <div class="avatar-lg me-4">
              <img
                src="https://www.shareicon.net/data/2016/05/26/771188_man_512x512.png"
                class="card-img-top rounded-circle border-white"
                alt="Bonnie Green"
              />
            </div>
            <div class="d-block">
              <h2 class="h5 mb-3">Hola, {{this.$store.state.user.name}}</h2>
            </div>
          </div>
          <div class="collapse-close d-md-none">
            <a
              href="#sidebarMenu"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="true"
              aria-label="Toggle navigation"
            >
              <i class="fas fa-times"></i>
            </a>
          </div>
        </div>

        <ul id="nav" class="nav flex-column pt-3 pt-md-0">
          <li class="nav-item">
            
          </li>
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <div data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
                <span class="sidebar-icon">
                  <i class="fas fa-exclamation-circle"></i>
                </span>
                <span class="sidebar-text">Denuncias</span>
              </div>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/informers" class="nav-link">
              <div data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
                <span class="sidebar-icon">
                  <i class="fas fa-users"></i>
                </span>
                <span class="sidebar-text">Denunciantes</span>
              </div>
            </router-link>
          </li>
          <li class="nav-item">
            <a
              style="background-color: white"
              href="#"
              class="
                btn
                d-flex
                align-items-center
                justify-content-center
                btn-upgrade-pro
              "
            >
              <span
                class="
                  sidebar-icon
                  d-inline-flex
                  align-items-center
                  justify-content-center
                "
              >
              </span>
              <span><img src="../assets/logo-coralina.png" /></span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <nav class="navbar navbar-dark navbar-theme-primary px-4 col-12 d-lg-none">
      <a class="navbar-brand me-lg-5" href="/">
        <img
          style="width: 80px; height: 60px"
          class="navbar-brand-dark"
          src="../assets/favicon.png"
          alt="Volt logo"
        />
        <br />
        Denuncias
      </a>
      <div class="d-flex align-items-center">
        <button
          class="navbar-toggler d-lg-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  name: "Sidebar"
};
</script>
