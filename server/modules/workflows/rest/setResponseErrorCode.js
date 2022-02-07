export default (error) => {
  if (!error.status)
    error.status =
      error.response && error.response.status ? error.response.status : 500
}
