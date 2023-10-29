import { noteResource } from '../helpers/entityResource.js'
import { confirm } from '../components/confirmation-modal.js';
import { confirm as confirmUnsavedChanges, UnsavedChangesConfirmationResult } from '../components/confirm-unsaved-changes.js';


function equalsIgnoreEmpty(a, b) {
    if (a == null || b == null) return true;
    return a.replace('&nbsp;', '') == b.replace('&nbsp;', '') || (!a && !b);
}

const noteDetail = {
    timeout: null,
    props: ['notebook_id', 'note_id'],
    data() {
        return {
            note: { title: null, content: null },
            refNote: { title: null, content: null }
        }
    },
    created () {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchOrCreateNote();
    },
    watch: {
        'note_id': 'fetchOrCreateNote',
        'note.title': 'debounceAutoSave',
        'note.content': 'debounceAutoSave',
        'note.url': 'debounceAutoSave'
    },
    mounted: function() {
        document.addEventListener("trix-change", this.setBody);
        document.addEventListener('keydown', this.keyListener);
    },
    beforeDestroy() {
        document.removeEventListener("trix-change", this.setBody);
        document.removeEventListener('keydown', this.keyListener);
    },
    computed: {
        newUrl() {
            return `/notebooks/${this.$route.params.notebook_id}/notes/new${queryString(this.$route.query)}`;
        },
        new() {
            return !this.note.id && this.note.title;
        },
        modified() {
            return (!(equalsIgnoreEmpty(this.note.title, this.refNote.title) && equalsIgnoreEmpty(this.note.content, this.refNote.content)));
        },
        dirty() {
            console.log("dirty()");
            console.log(this.new || this.modified);
            return this.new || this.modified;
        }
    },
    methods: {
        debounceAutoSave() {
            if (!this.dirty) return;

            // TODO: Cancel timeout when save warning dialog appears (or remove dialog entirely)
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            var that = this;
            this.timeout = setTimeout(function() { if (that.dirty) that.saveNote(); }, 2000);
        },
        fetchOrCreateNote() {
            clearTimeout(this.timeout);
            this.timeout = null;
            if (this.note_id) this.fetchNote(); else this.createNote();
        },
        createNote() {
            this.prepareNote(noteResource.createNew(this.notebook_id));
            
            if (this.$refs.trix) {
                this.$refs.trix.editor.loadHTML(this.note.content);
            }
        },
        prepareNote(data) {
            // Bad hack: backend insists on saving <br> has <br />, while 
            // trix editor insists on saving <br /> as <br>. 
            // This disagreement causes problems in the dirty check
            // prevent this by modifying data.content
            // (TODO: Move to resource, or some filter or perhaps in filter in backend)
            data.content = data.content.replaceAll("<br />", "<br>");

            console.log("prepareNote");
            this.note = data;
            this.refNote = {...data};
            
            if (this.$refs.trix) {
                var originalPosition = this.$refs.trix.editor.getPosition();
                this.$refs.trix.editor.loadHTML(this.note.content);
                // retain cursor position
                this.$refs.trix.editor.setSelectedRange(originalPosition);
            }
        },
        fetchNote() {
            noteResource.get(this.note_id).then(data => this.prepareNote(data));
        },
        setBody(e) {
            this.note.content = document.getElementById('hiddenContent').value;
        },
        saveNote() {
            noteResource.save(this.note).then(data => this.prepareNote(data));
        },
        deleteNote() {
            confirm("Are you sure you want to delete this note?").then(
                () => { noteResource.delete(this.note); }, // resolved
                () => { /* no action */ },                 // rejected
            );
        },
        keyListener(e) {
            if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault(); // present "Save Page" from getting triggered.
                if (this.dirty) this.saveNote();
            }
        },
        confirmOrSave(next) {
            clearTimeout(this.timeout)

            // If note contains unsaved changes, ask to save
            if (this.dirty) {
                confirmUnsavedChanges("There are unsaved changes").then(
                    // resolved
                    (result) => {

                        switch (result) {
                            case UnsavedChangesConfirmationResult.DISCARD:
                            next();
                            break;
                            
                            
                            case UnsavedChangesConfirmationResult.SAVE:
                            noteResource.save(this.note).then(data => {
                                next();    
                            })
                            break;

                            default:

                        }
                    },
                    // rejected
                    () => {
                        next();
                    }
                );
            } else {
                next();    
            }
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.confirmOrSave(next)
    },
    beforeRouteLeave (to, from, next) {
        this.confirmOrSave(next)
    },
    template: 
        `<div v-if="note" class="card" id="note">
            <div class="card-header d-flex">
                <input type="text" id="title" placeholder="Give your note a title" v-model="note.title">
                <div><button :disabled='!dirty' v-on:click="saveNote" class="btn btn-dark btn-braindump btn-sm"><i class="fa fa-save"></i></button></div>&nbsp;
                <div><button v-on:click="deleteNote" class="btn btn-dark btn-braindump btn-sm"><i class="fa fa-trash"></i></button></div>
            </div>
            <div class="card-body">
                    <div class="form-group">
                        <input type="url" class="form-control" id="url" v-model="note.url" placeholder="Add a link here if relevant">
                    </div>
                    <input id="hiddenContent" type="hidden" name="content" v-model="note.content">
                    <trix-editor ref="trix" input="hiddenContent"></trix-editor>
            </div>
         </div>`
}

export default noteDetail;