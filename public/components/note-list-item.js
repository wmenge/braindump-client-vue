import queryString from '../helpers/queryString.js'

var NoteListItem = {
    props: ['note'],
    computed: {
        url: function() {
            return `/notebooks/${this.note.notebook_id}/notes/${this.note.id}${queryString(this.$route.query)}`;
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