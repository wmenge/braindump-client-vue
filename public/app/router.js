import noteList from '../components/note-list.js';
import noteDetailComponent from '../components/note-detail.js';

// Routes
const routes = [
    {
        path: '/notes', 
        component: noteList,
        props: true,
        children: [
            {
                path: '',
                component: noteDetailComponent,
                props: true
            },
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
    },
    {
        path: '/notebooks/:notebook_id/notes', 
        component: noteList,
        props: true,
        children: [
            {
                path: '',
                component: noteDetailComponent,
                props: true
            },
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

export default router;