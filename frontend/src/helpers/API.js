import axios from "axios";
// import * as SecureStore from "expo-secure-store";

export class Api {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.url = "http://127.0.0.1:7001";
    // this.tenantId = "01GZC2R8Y7K4AWHMP31EDQXT3D";
  }

  async makeRequest(endpoint, data) {
    // console.log();
    const result = {
      result: null,
      data: null,
    };

    const response = await axios
      .post(
        `${this.url}/${endpoint}`,
        data
        // {
        //   headers: {
        //     API_KEY: this.apiKey,
        //     Authorization: `Bearer ${userToken}`,
        //     tenantId: this.tenantId,
        //   },
        // }
      )
      .catch((err) => ({ err }));

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

  async getAllEvents(data) {
    return this.makeRequest("", data);
  }
}

const api = new Api("apiKey");

export default api;
