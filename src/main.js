import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import { Dropdown } from 'bootstrap'
import tippy, {followCursor} from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import maxSize from 'popper-max-size-modifier'

const applyMaxSize = {
  name: 'applyMaxSize',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['maxSize'],
  fn({state}) {
    const {width, height} = state.modifiersData.maxSize;
 
    state.styles.popper = {
      ...state.styles.popper,
      maxWidth: `${width}px`,
      maxHeight: `${height}px`
    };
  }
};

let app = createApp(App);

// DIRECTIVE

app.directive('tippy', {
  mounted: function(el, binding) {
    let placement = binding.modifiers.right ? 'right' :
      binding.modifiers.left ? 'left' :
      binding.modifiers.top ? 'top' :
      binding.modifiers.bottom ? 'bottom' : 'top';

    tippy(el, {
      content: binding.value,
      arrow: false,
      offset: [0, 20],
    }); 
  },
})

app.directive('tippy-player', {
  mounted: function(el, binding) {
    tippy(el, {
      allowHTML: true,
      interactive: true,
      arrow: false,
      appendTo: () => document.body,
      popperOptions: {
        modifiers: [
          maxSize,
          applyMaxSize,
        ],
      },
      maxWidth: 700,
      content: binding.value,
    }); 
  },
})

app.directive('tippy-progress', {
  mounted: function(el, binding) {
    el.tippyProgress = tippy(el, {
      followCursor: 'horizontal',
      hideOnClick: false,
      plugins: [followCursor],
      offset: [0, 2],
    }); 
  },
})

app.directive('scroll', {
  mounted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        el.removeEventListener('scroll', f)
      }
    }
    el.addEventListener('scroll', f)
  }
})

app.use(router).mount('#app');

