import { EventBus } from '../app/event-bus.js';
import queryString from '../helpers/queryString.js'

var notebookListItem = {
    props: ['notebook', 'count'],
    computed: {
        url: function() {
            return this.notebook.id ? `/notebooks/${this.notebook.id}/notes${queryString(this.$route.query)}` : '/notes';
        },
        isActive() {
            return (this.notebook.id == this.$route.params.notebook_id);
        }
    },
    methods: {
        select() {
            EventBus.$emit('notebook-selected', {...this.notebook});
        }
    },
    template: `
        <router-link v-bind:to="url" v-on:click.native="select" class="list-group-item" v-bind:class="{ braindumpActive: isActive }">
            <div class="float-left" style="max-width: 165px;">{{notebook.title}}</div>
            <span class="badge badge-primary bg-braindump float-right">{{count ? count :notebook.noteCount}}</span>
        </router-link>`
};

export default notebookListItem;