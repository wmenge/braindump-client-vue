import resource from '../helpers/resource.js'
import { EventBus } from '../app/event-bus.js';
import queryString from '../helpers/queryString.js'
import NotificationBus from '../app/notification-bus.js';

const endpoints ={
    notebooks: "/notebooks",
    notes: "/notes"
}

function localSave(endpoint, resourceName, object) {
    NotificationBus.$Progress.start();
    if (object.id) {
        const promise = resource.put(`${endpoint}/${object.id}`, object);
        promise.then(
            data => { 
                NotificationBus.$Progress.finish();
                EventBus.$emit(`${resourceName}-updated`, data); 
            },
            reasons => {
                NotificationBus.$Progress.fail();
            }
        );
        return promise;
    } else {
        const promise = resource.post(endpoint, object);
        promise.then(
            data => { 
                NotificationBus.$Progress.finish();
                EventBus.$emit(`${resourceName}-created`, data);
            },
            reasons => {
                NotificationBus.$Progress.fail();
            }
        );
        return promise;
    }
}

function localDelete(endpoint, resourceName, object) {
    const promise = resource.delete(`${endpoint}/${object.id}`);
    promise.then(EventBus.$emit(`${resourceName}-deleted`, object));
    return promise;
}

const notebookResource = {
	createNew() {
		return { title: "" };
	},
	getAll(query) {
		return resource.get(`/notebooks${queryString(query)}`);
	},
    get(id) {
        return resource.get(`/notebooks/${id}`);
    },
	save(notebook) {
		return localSave('/notebooks', 'notebook', notebook)
	},
    delete(notebook) {
        return localDelete('/notebooks', 'notebook', notebook);
    }
}

const noteResource = {
    createNew(notebook_id) {
        return { title: null, type: "HTML", content: "", notebook_id: notebook_id };
    },
    getAll(query) {
        return resource.get(`/notes${queryString(query)}`);
    },
    getFor(notebook_id, query) {
        return resource.get(`/notebooks/${notebook_id}/notes${queryString(query)}`)
    },
    get(id) {
        return resource.get(`/notes/${id}`);
    },
    save(note) {
        return localSave(`/notebooks/${note.notebook_id}/notes`, 'note', note)
    },
    delete(note) {
        return localDelete(`/notebooks/${note.notebook_id}/notes`, 'note', note);
    }
}

export { notebookResource, noteResource };