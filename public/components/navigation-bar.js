import resource from '../helpers/resource.js'
import queryString from '../helpers/queryString.js'
import { notificationHelper } from './notification-list.js'
import configuration from '../config.js'

const NavigationBar = {
    data() {
        return {
            user: null,
            searchQuery: null
        };  
    },
    created() {
        // fetch the data when the view is created and the data is
        // already being observed
        if (this.$route.query.q) {
            this.searchQuery = this.$route.query.q;
        }
        resource.get('/user').then(data => this.user = data);
    },
    computed: {
        newUrl() {
            return `/notebooks/${this.$route.params.notebook_id}/notes/new${queryString(this.$route.query)}`;
        },
        logoutUrl() {
            return configuration.logoutUrl;
        },
        creationDisabled() {
            return !this.$route.params.notebook_id;
        }
    },
    methods: {
        search() {
            this.$router.push({ query: { q: (this.searchQuery) ? this.searchQuery : "" } });
        }
    },
    template: `
        <nav class="navbar navbar-expand-lg navbar-dark bg-braindump">
            <a class="navbar-brand" href="#"><i class="fas fa-brain"></i> Braindump</a>
            
            <div class="collapse navbar-collapse" id="">
                
                <div id="search" class="form-inline">

                    <form v-on:submit.prevent="search">
                        <div class="input-group mr-sm-2">
                            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search">
                            <div class="input-group-append">
                                <button class="btn btn-outline-light my-2 my-sm-0" type=submit><i class="fa fa-search"></i></button>&nbsp;
                            </div>
                        </div>
                    </form>
                    <router-link v-bind:to="newUrl" class="btn btn-outline-light my-2 my-sm-0" v-bind:class="{ disabled: creationDisabled }"><i class="fa fa-plus"></i> Add note</router-link>
                </div>

                <ul v-if="user" class="navbar-nav ml-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-user"></i>{{user.name}}</a>
                        <div class="dropdown-menu" aria-labelledby="dropdown01">
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#settingsModal">Settings</a>
                        <a class="dropdown-item" v-bind:href="logoutUrl">Logout</a>
                    </div>
                    </li>
                </ul>
                
            </div>
        </nav>`
};

export default NavigationBar;