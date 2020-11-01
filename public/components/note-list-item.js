import queryString from '../helpers/queryString.js'
import moment from '../lib/moment/dist/moment.js';

var NoteListItem = {
    props: ['note'],
    computed: {
        url: function() {
            return ((this.$route.params.notebook_id) ?
                `/notebooks/${this.$route.params.notebook_id}` :
                '') + `/notes/${this.note.id}${queryString(this.$route.query)}`;
        },
        isActive() {
            return (this.note.id == this.$route.params.note_id);
        }
    },
    filters: {
        moment: function (date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        }
    },
    template: `
        <router-link v-bind:to="url" class="list-group-item" v-bind:class="{ braindumpActive: isActive }">
            <div>{{ note.title }}</div>
            <time>{{ note.updated * 1000 | moment }}</time>
        </router-link>`
}

export default NoteListItem;