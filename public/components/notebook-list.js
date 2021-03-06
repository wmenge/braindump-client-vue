import { notebookResource } from '../helpers/entityResource.js'
import { EventBus } from '../app/event-bus.js';
import queryString from '../helpers/queryString.js'

var notebookList = {
	props: ['notebook'],
	data() {
	    return {
	        notebooks: null,
	        allNotes: { title: "All notes" }
	    }
	},
	created() {
	    // fetch the data when the view is created and the data is
	    // already being observed
	    this.fetchData()

	    EventBus.$on('note-created', note => {
            this.notebooks.find(notebook => notebook.id == note.notebook_id).noteCount++;
        });

        EventBus.$on('note-deleted', note => {
            this.notebooks.find(notebook => notebook.id == note.notebook_id).noteCount--;
        });

        EventBus.$on('notebook-created', newNotebook => {
            this.notebooks.push({ ...newNotebook});
        });

        EventBus.$on('notebook-updated', updatedNotebook => {
            let existingNotebook = this.notebooks.find(notebook => notebook.id == updatedNotebook.id);
            existingNotebook.title = updatedNotebook.title;
        });

        EventBus.$on('notebook-deleted', deletedNotebook => {
            let existingNotebook = this.notebooks.find(notebook => notebook.id == deletedNotebook.id);
            let index = this.notebooks.indexOf(existingNotebook);
            this.notebooks.splice(index, 1);
            this.selectFirst();
        });
	},
	computed: {
        sortedNotebooks() {
        	return this.notebooks ? this.notebooks.sort((a, b) => a.title.localeCompare(b.title, undefined, {sensitivity: 'base'})) : null;
        },
        totalNoteCount() {
        	return (!this.notebooks) ? 0 : this.notebooks.reduce(function(a, b) {
	            return a + b.noteCount;
	        }, 0);
        }
    },
	methods: {
	    async fetchData() {
	    	this.notebooks = await notebookResource.getAll({ sort: 'title' });
	    	if (this.notebooks.length > 0 && !this.$route.params.notebook_id) {
	    		this.selectFirst();
			}
	    },
	    createNotebook() {
	    	// TODO: need vuex to manage some global state
	    	this.$parent.notebook =notebookResource.createNew(); //{ title: "" };
	    	$("#notebookModal").modal("show");
	    },
	    selectFirst() {
	    	this.$router.push(`/notes${queryString(this.$route.query)}`);
	    }
	},
	template: `
	    <div class="card" id="notebooks">
	        <div class="card-header">
	            Notebooks
	            <div class="float-right">
	                <button class="btn btn-sm btn-dark btn-braindump" v-on:click="createNotebook"><i class="fa fa-plus"></i></button>
	            </div>
	        </div>
	        <div class="list-group list-group-flush">
	        	<notebook-list-item v-bind:notebook="allNotes" v-bind:count="totalNoteCount"
	            />
	            <notebook-list-item
	              v-for="notebook in sortedNotebooks"
	              v-bind:key="notebook.id"
	              v-bind:notebook="notebook"
	            />
	        </div>
	    </div>`
};

export default notebookList;