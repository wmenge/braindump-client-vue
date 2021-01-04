import resource from '../helpers/resource.js';
import notebookList from '../components/notebook-list.js';
import notebookListItem from '../components/notebook-list-item.js';
import noteBookHeader from '../components/notebook-header.js';
import noteListItem from '../components/note-list-item.js';

import { notificationList } from '../components/notification-list.js';

import navigationBar from '../components/navigation-bar.js';
import createNotebookModal from '../components/create-notebook-modal.js';
import settingsModal from '../components/settings-modal.js';
import { confirmationModalComponent } from '../components/confirmation-modal.js';
import router from './router.js';

Vue.component('notebook-list', notebookList);
Vue.component('notebook-list-item', notebookListItem);
Vue.component('note-list-item', noteListItem);
Vue.component('navigation-bar', navigationBar);
Vue.component('notebook-header', noteBookHeader);
Vue.component('notification-list', notificationList);
Vue.component('create-notebook-modal', createNotebookModal);
Vue.component('settings-modal', settingsModal);
Vue.component('confirmation-modal', confirmationModalComponent);

function equalsIgnoreEmpty(a, b) {
    if (a == null || b == null) return true;
    return a.replace('&nbsp;', '') == b.replace('&nbsp;', '') || (!a && !b);
}

// App
let app = new Vue({
    data: {
        // still needed? 
        notebook: { title: '' },
        note: { title: null, content: null },
        refNote: { title: null, content: null },
    },
    computed: {
        dirty() {
            return !(equalsIgnoreEmpty(this.note.title, this.refNote.title) && equalsIgnoreEmpty(this.note.content, this.refNote.content));
        }
    },
    methods: {
        setNote(data) {
            this.note = data;
            this.refNote = {...data};
        },
        clean() {
            this.note = { title: null, content: null };
            this.refNote = { title: null, content: null };
        }
    },
    router: router,
    el: '#app'
});

export default app;