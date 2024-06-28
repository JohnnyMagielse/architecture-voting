import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import the fontawesome core
import { library } from "@fortawesome/fontawesome-svg-core";

// import fontawesome icon component
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// import config so we can set a default style
import { config } from "@fortawesome/fontawesome-svg-core";

// import icon styles
import { faArrowLeft, faHouse, faUser, faCheckToSlot, faSquarePollHorizontal} from "@fortawesome/free-solid-svg-icons";

// add the icon styles you have installed to the library
library.add(faArrowLeft, faHouse, faCheckToSlot, faUser, faSquarePollHorizontal);

// set the default style
config.familyDefault = "classic";
config.styleDefault = "duotone";

const app = createApp(App)

app.use(router)

app.component("font-awesome-icon", FontAwesomeIcon).mount('#app')
