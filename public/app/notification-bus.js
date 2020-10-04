// Global event bus
// https://www.digitalocean.com/community/tutorials/vuejs-global-event-bus

const VueProgressBar = window.VueProgressBar

Vue.use(VueProgressBar, {
  color: '#bacaff',
  failedColor: 'red',
  thickness: '4px',
  transition: {
    speed: '1s',
    opacity: '0.6s',
    termination: 300
  }
})

let NotificationBus = new Vue();

export default NotificationBus;