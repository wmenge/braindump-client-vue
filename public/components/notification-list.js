var outSideNotificationComponent = null;

// give all notifications a unique index during lifecycle
var index = 0;

var notificationList = {
	data() {
	    return {
	        notifications: [],
	    }
	},
	created() {
		outSideNotificationComponent = this;
	},
	methods: {
	    addNotification(type, text, delay = 1500) {
	    	// give all notifications a unique index during lifecycle
	    	index++;
	    	let notification = { type: type, text: text, index: index };
	    	notification.timeOut = setTimeout(function() { outSideNotificationComponent.remove(notification) }, delay);
	    	this.notifications.push(notification);
	    },
	    remove(notification) {
	    	if (notification.timeOut) {
	    		clearTimeout(notification.timeOut);
	    	}
			let index = this.notifications.indexOf(notification);
            this.notifications.splice(index, 1);
	    }
	},
	template: `
	    <div class="" id="notification-area">

			<transition-group name="list">
	    
	    		<div v-for="notification in notifications" v-bind:key="notification.index">

	      			<div class="alert" v-bind:class="notification.type" role="alert">
					  {{notification.text}}
					  <button type="button" class="close" aria-label="Close" v-on:click="remove(notification)">
					    <span aria-hidden="true">&times;</span>
					  </button>
					</div>
		      	
		      	</div>
	    
	    	</transition-group>
		
	    </div>`
};

var notificationHelper = {
	info(text) {
		outSideNotificationComponent.addNotification('alert-info', text);
	},
	success(text) {
		outSideNotificationComponent.addNotification('alert-success', text);
	},
	warning(text) {
		outSideNotificationComponent.addNotification('alert-warning', text, 3000);
	},
	danger(text) {
		outSideNotificationComponent.addNotification('alert-danger', text, 3000);
	}
}

export { notificationList, notificationHelper };