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
import { confirmationModalComponent as confirmationUnsavedChangesModalComponent } from '../components/confirm-unsaved-changes.js';
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
Vue.component('confirmation-modal-unsaved-changes', confirmationUnsavedChangesModalComponent);

// App
let app = new Vue({
    data: {
        // still needed? 
        notebook: { title: '' }
    },
    router: router,
    el: '#app'
});

export default app;