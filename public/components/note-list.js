import { noteResource } from '../helpers/entityResource.js'
import queryString from '../helpers/queryString.js'
import { EventBus } from '../app/event-bus.js';

var NoteList = {
    props: ['notebook_id'],
    data() {
        return {
            notes: null,
        }
    },
    created() {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData()
    
        EventBus.$on('note-created', newNote => {
            this.notes.push({ ...newNote});
            this.$router.push(''+newNote.id);
        });

        EventBus.$on('note-updated', updatedNote => {
            let existingNote = this.notes.find(note => note.id == updatedNote.id);
            existingNote.title = updatedNote.title;
            existingNote.updated = updatedNote.updated;
        });

        EventBus.$on('note-deleted', deletedNote => {
            console.log('on note-deleted');
            let existingNote = this.notes.find(note => note.id == deletedNote.id);
            let index = this.notes.indexOf(existingNote);
            this.notes.splice(index, 1);
            this.selectFirstOrNew();
            //this.$router.push(`/notebooks/${notebook_id}/notes/new${queryString(this.$route.query)}`);
        });
    },
    watch: {
        // call again the method if the route changes
        'notebook_id': 'fetchData',
        //'$route.query': 'fetchData',
        '$route.query.q': 'fetchData',
        '$route.query.sort': 'fetchData'
    },
    computed: {
        sortedNotes() {
            return this.notes;// ? this.notes.sort((a, b) => a.title.localeCompare(b.title, undefined, {sensitivity: 'base'})) : null;
        },
        newUrl() {
            return `/notebooks/${this.$route.params.notebook_id}/notes/new${queryString(this.$route.query)}`;
        }
    },
    methods: {
        // TODO: Get data in router (before nav)
        async fetchData() {
            if (!this.$route.query.sort) this.$route.query.sort = '-updated';

            let notes = this.notebook_id ? 
                await noteResource.getFor(this.notebook_id, this.$route.query) :
                await noteResource.getAll(this.$route.query);

            this.notes = notes;
            
            if (!this.$route.params.note_id && !this.$route.path.includes('/new')) {
                this.selectFirstOrNew();
            }
        },
        selectFirstOrNew() {
            //if (!this.$route.params.note_id && !this.$route.path.includes('/new')) {

                let notebookPart = this.$route.params.notebook_id ? `/notebooks/${this.$route.params.notebook_id}` : '';
                if (this.notes.length > 0) {
                    this.$router.push(`${notebookPart}/notes/${this.notes[0].id}${queryString(this.$route.query)}`);
                } else {
                    this.$router.push(`${notebookPart}/notes/new${queryString(this.$route.query)}`);
                }
            //}
        }
    },
    template: 
        `<span>
            <router-view></router-view>
            <div class="card" id="notes">
                <notebook-header notebook="notebook"></notebook-header>
                <div class="card-body empty" v-if="!notes || notes.length === 0">
                    <strong>No notes</strong> in this notebook. You can create a <router-link v-bind:to="newUrl">new note.</router-link>
                    </div>
                <div class="list-group list-group-flush">
                    <note-list-item
                        v-for="note in sortedNotes"
                        v-bind:key="note.id"
                        v-bind:note="note"
                    />
                 </div>
             </div>      
         </span>`
}

export default NoteList;