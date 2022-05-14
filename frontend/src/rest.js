import axios from 'axios'

export const fetchActions = () =>
  axios.get(`${process.env.VUE_APP_REST}/actions`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
