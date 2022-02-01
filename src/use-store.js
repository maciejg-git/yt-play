import { reactive } from 'vue'

let state = reactive({
  filter: '',
})

export default function useStore() {
  return state
}
