import { EventBus } from '../app/event-bus.js';
import queryString from '../helpers/queryString.js'

var notebookListItem = {
    props: ['notebook'],
    computed: {
        url: function() {
            // remove search from querystring: when changing notebook we want to reset search
            delete this.$route.query.q;
            return `/notebooks/${this.notebook.id}/notes${queryString(this.$route.query)}`;
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
            <span class="badge badge-primary bg-braindump float-right">{{notebook.noteCount}}</span>
        </router-link>`
};

export default notebookListItem;