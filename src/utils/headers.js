module.exports = {
  get() {
    const headers = {};
    headers['Accept'] = 'application/json';
    return headers;
  },
  post() {
    const headers = {};
    headers['Accept'] = 'application/json';
    return headers;
  },
  delete() {
    const headers = {};
    headers['Accept'] = 'application/json';
    return headers;
  },
  put() {
    const headers = {};
    headers['Accept'] = 'application/json';
    return headers;
  },
  postAuth(bearer) {
    const headers = {};
    headers['Accept'] = 'application/json';
    headers['Authorization'] = bearer;
    return headers;
  }
}