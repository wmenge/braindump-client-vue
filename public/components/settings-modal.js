import resource from '../helpers/resource.js'

const component = {
    data() {
        return {
            configuration: { email: null, email_to_notebook: null },
            notebooks: []
        };
    },
    created() {
        resource.get(`/notebooks`).then(data => {
            // todo: event so that list can reload
            this.notebooks = data;
        });
        resource.get(`/configuration`).then(data => {
            // todo: event so that list can reload
            this.configuration = data;
        });
    },
    methods: {
        saveConfiguration() {
            resource.put(`/configuration`, this.configuration).then(data => {
                // todo: event so that list can reload
                $("#settingsModal").modal("hide");
            });      
        }
    },
    template: `
<div class="modal fade" id="settingsModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Settings</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="email">Your email address</label>
            <input class="form-control" id="email" placeholder="Add your email address" v-model="configuration.email">
          </div>
          <div class="form-group">
            <label for="email_to_notebook">Save notes from your email into notebook</label>
            <select class="form-control" id="email_to_notebook" v-model="configuration.email_to_notebook">
              <option
                  v-for="notebook in notebooks"
                  v-bind:key="notebook.id"
                  v-bind:value="notebook.id"
              >{{notebook.title}}</option>
            </select>
            <small class="form-text text-muted">Send a mail from your address to braindump.wilcomenge@gmail.com</small>
          </div>
          
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" v-on:click="saveConfiguration">Save</button>
      </div>
    </div>
  </div>
</div>`
};

export default component;