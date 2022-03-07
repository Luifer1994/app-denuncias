<template>
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
          <h5 class="modal-title" v-if="!user_asigne" id="asigneUser">
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
          <div
            class="mb-3"
            v-if="
              !user_asigne ||
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
          <div class="mb-3">
            <label class="form-label">Agregar detalles:</label>
            <textarea v-model="detail" class="form-control" rows="5"></textarea>
          </div>
          <div class="d-flex justify-content-center" v-if="uploadResponse">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div class="mb-3" v-if="state !== 'INICIADA' && !inquiry">
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
          <div v-if="!user_asigne">
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