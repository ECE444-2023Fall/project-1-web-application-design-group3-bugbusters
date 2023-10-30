import axios from "axios";
// import * as SecureStore from "expo-secure-store";

export class Api {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.url = "http://127.0.0.1:7001"; // Local testing
    // this.tenantId = "01GZC2R8Y7K4AWHMP31EDQXT3D";
  }

  async makeRequest(endpoint, data, method) {
    const result = {
      result: null,
      data: null,
    };

    const response = await axios({
      method: method,
      url: `${this.url}/${endpoint}`,
      data: data,
    }).catch((err) => ({ err }));

    if (!response || response.err) {
      // error
      result.result = "ERROR";
      result.data = response.err;
    } else {
      // successful
      result.result = "SUCCESSFUL";
      result.data = response.data;
    }

    return result;
  }

  async getAllEvents(data = null) {
    return this.makeRequest("", data, "GET");
  }
}

const api = new Api("apiKey");

export default api;
