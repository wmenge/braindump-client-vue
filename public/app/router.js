import noteList from '../components/note-list.js';
import noteDetailComponent from '../components/note-detail.js';
import { confirm } from '../components/confirmation-modal.js';
import { noteResource } from '../helpers/entityResource.js'

// Routes
const routes = [
    {
        path: '/notebooks/:notebook_id/notes', 
        component: noteList,
        props: true,
        children: [
            {
                path: 'new',
                component: noteDetailComponent,
                props: true
            },
            {
                path: ':note_id',
                component: noteDetailComponent,
                props: true
            }
        ]
    }
];

const router = new VueRouter({
    routes // short for `routes: routes`
});

// TODO: move to note detail, we can access the router from there
// adn then we don't need to expose the dirty state to the app 
// but we can keep it in the component!
router.beforeEach((to, from, next) => {

    // If note contains unsaved changes, ask to save
    if (router.app.dirty) {
        confirm("Your changes have not been saved. Save now?").then(
            // resolved
            () => {
                noteResource.save(router.app.note).then(data => {
                    router.app.clean();
                    next();    
                })
            },
            // rejected
            () => {
                router.app.clean();
                next();
            }
        );
        //return;
    } else {
        next();    
    }

});

export default router;