/**
 * Request States
 */
const RequestStates = {
  'UNSENT': 0,
  'OPENED': 1,
  'HEADERS_RECEIVED': 2,
  'LOADING': 3,
  'DONE': 4
};

/**
 * Request Status
 */
const RequestStatus = {
  'OK': 200
}

/**
 * Request Methods
 */
const RequestMethods = {
  'GET': 'GET',
  'POST': 'POST',
  'PUT': 'PUT',
  'DELETE': 'DELETE'
}

/**
 * XMLHttpRequest Helper Class
 */
class Request {
  req;
  url;
  method = RequestMethods.GET;

  /**
   * Create a new Request
   * @param url Url to create a request
   */
  constructor(url) {
    this.url = url;
    this.req = new XMLHttpRequest();
  }

  /**
   * Transform a object into a query string
   * @param params Parameter object value
   */
  formatParams(params) {
    return "?" + Object
      .keys(params)
      .map(function (key) {
        return key + "=" + encodeURIComponent(params[key])
      })
      .join("&")
  }

  /**
   * Transform object into a FormData
   * @param data Data object value
   */
  fromData(data) {
    let formData = new FormData();

    Object
      .keys(data)
      .map(function (key) {
        return formData.append(key, data[key]);
      })

    return formData;
  }

  /**
   * Send a request and return a promise
   * @param query Object to query string (GET)
   * @param data Object to sen data (POST)
   */
  request(query, data) {
    const that = this;

    const prom = new Promise((resolve, reject) => {
      that.req.onreadystatechange = function () {

        if (that.req.readyState === RequestStates.DONE) {
          if (that.req.status === RequestStatus.OK) {
            resolve(that.req.response);
          } else {
            reject(that.req)
          }
        }
      };
    });

    let url = this.url;

    // format url with query
    if (query) {
      url += this.formatParams(query);
    }

    // Open Request
    this.req.open(this.method, url, true);

    // Send data if needed
    if (data) {
      this.req.send(this.fromData(data));
    } else {
      this.req.send();
    }

    // Return Promise
    return prom;
  }

  get(query) {
    this.method = RequestMethods.GET;
    return this.request(query);
  }

  getJSON(query) {
    this.req.responseType = 'json';
    this.req.overrideMimeType('application/json');
    return this.get(query);
  }

  post(data) {
    this.method = RequestMethods.POST;
    return this.request(null, data);
  }

  put(data) {
    this.method = RequestMethods.PUT;
    return this.request(null, data);
  }
}

export { RequestStates, RequestStatus, RequestMethods, Request };