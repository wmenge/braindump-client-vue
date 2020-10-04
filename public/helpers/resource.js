// TODO: remove coupling
import { notificationHelper } from '../components/notification-list.js';
import configuration from '../config.js';

var resource = {
    get(resource) {
        return this.fetch(resource, "GET", null);
    },
    post(resource, body) {
        return this.fetch(resource, "POST", body);
    },
    put(resource, body) {
        return this.fetch(resource, "PUT", body);
    },
    delete(resource) {
        return this.fetch(resource, "DELETE", null);
    },
    fetch(resource, method, body) {
        console.debug(resource, method, body);
        return fetch(configuration.apiUrl + resource, {
            "headers": this.headers(body),
            "method": method,
            "body": ((body == null) ? null : JSON.stringify(body)),
            "mode": "cors",
            "credentials": "include"
        }).then(
            response => {
                // todo: move to separate event handler
                if(response.status==401) {
                    window.location = configuration.loginUrl;
                    let rejectedPromise = new Promise(function(res, rej) { rej(); });
                    //rejectedPromise.reject();
                    return rejectedPromise;
                }

                // todo: move to separate event handler
                if (response.status >= 300) {
                    response.text().then(text => {
                        console.log(text);
                        notificationHelper.danger(`${response.status}: ${response.statusText} ${text}`);
                    });
                    let rejectedPromise = new Promise(function(res, rej) { rej(); });
                    //rejectedPromise.reject();
                    return rejectedPromise;
                }
                
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json()
                } else {
                    return response.text()
                }
            },
            () => {
                // todo: move to separate handler
                notificationHelper.danger("Can't connect to backend");
            });
    },
    headers(body) {
        if (body) {
            return {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        } else {
            return {
                "Content-Type": "application/json"
            }
        }
    }
};

export default resource;