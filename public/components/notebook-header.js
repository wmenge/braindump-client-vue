import { EventBus } from '../app/event-bus.js';
import queryString from '../helpers/queryString.js'
//import resource from '../helpers/resource.js'
import { notebookResource } from '../helpers/entityResource.js'
import { confirm } from '../components/confirmation-modal.js';

var NotebookHeader = {
    data() {
        return {
            notebook: null
        };
    },
    created() {
        EventBus.$on('notebook-selected', notebook => {
            this.notebook = notebook;
        });

        this.fetchNotebook();
    },
    watch: {
        '$route.params.notebook_id': 'fetchNotebook'
    },
    computed: {
        sortDateAsc() {
            let query = {...this.$route.query}
            query.sort = 'updated';
            return this.$route.path + queryString(query);
        },
        sortDateDesc() {
            let query = {...this.$route.query}
            query.sort = '-updated';
            return this.$route.path + queryString(query);
        },
        sortTitleAsc() {
            let query = {...this.$route.query}
            query.sort = 'title';
            return this.$route.path + queryString(query);
        },
        sortTitleDesc() {
            let query = {...this.$route.query}
            query.sort = '-title';
            return this.$route.path + queryString(query);
        }
    },
    methods: {
        async fetchNotebook() {
            if (this.$route.params.notebook_id && !this.notebook) {
                this.notebook = await notebookResource.get(this.$route.params.notebook_id);
                //resource.get(`/notebooks/${this.$route.params.notebook_id}`).then(data => this.notebook = data);
            }
        },
        changeNotebook() {
            // TODO: need vuex to manage some global state
            this.$parent.$parent.notebook = this.notebook;
            $("#notebookModal").modal("show");
        },
        deleteNotebook() {
            confirm("Are you sure you want to delete this notebook and all its notes?").then(
                () => { notebookResource.delete(this.notebook); }, // resolved
                () => { /* ignore */ }                             // rejected
            );
        }
    },
    template: 
        `<div class="card-header">
            {{notebook ? notebook.title : ""}}
            <div class="float-right">
                <div class="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" class="btn btn-dark btn-braindump dropdown-toggle btn-sm" data-toggle="dropdown">
                    </button>
                    <div class="dropdown-menu">
                        <router-link v-bind:to="sortDateAsc" class="dropdown-item">Sort by date (old..new)</router-link>
                        <router-link v-bind:to="sortDateDesc" class="dropdown-item">Sort by date (new..old)</router-link>
                        <div class="dropdown-divider"></div>
                        <router-link v-bind:to="sortTitleAsc" class="dropdown-item">Sort by title (a..z)</router-link>
                        <router-link v-bind:to="sortTitleDesc" class="dropdown-item">Sort by title (z..a)</router-link>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" v-on:click="changeNotebook" href="#">Change Title</a>
                        <a class="dropdown-item" data-toggle="modal" v-on:click="deleteNotebook">Delete notebook</a>
                    </div>
                </div>
            </div>
        </div>`
}

export default NotebookHeader;