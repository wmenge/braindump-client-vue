import { notebookResource } from '../helpers/entityResource.js'
import { EventBus } from '../app/event-bus.js';
import queryString from '../helpers/queryString.js'

const component = {
    props: ['notebook'],
    created() {
        EventBus.$on('notebook-created', notebook => {
            this.notebook = notebook;
            // check if we can isolate this in one place (now happens here and in notebook list)
            EventBus.$emit('notebook-selected', {...notebook});
            // navigate to new notebook
            let query = {...this.$route.query}
            query.sort = 'updated';
            this.$router.push(`/notebooks/${notebook.id}/notes${queryString(query)}`);
        });        
    },
    methods: {
        createNotebook() {
            notebookResource.save(this.notebook).then(() => {
                $("#notebookModal").modal("hide");
            });
        }
    },
    template: `
<div class="modal fade" id="notebookModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">{{notebook.id ? "Change" : "Create"}} notebook</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Give your notebook a title" v-model="notebook.title">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" v-on:click="createNotebook">Save</button>
      </div>
    </div>
  </div>
</div>`
};

export default component;