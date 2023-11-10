import axios from "axios";
// import * as SecureStore from "expo-secure-store";

export class Api {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.url = process.env.EXPO_PUBLIC_BASE_API_URL;
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
  s;

  async getAllEvents() {
    return this.makeRequest("event-service/", null, "GET");
  }

  async getEvent(id) {
    return this.makeRequest(`event-service/${id}`, null, "GET");
  }

  async getUserProfile(uid) {
    return this.makeRequest(`user-service/${uid}`, null, "GET");
  }

  async createUserProfile(data) {
    return this.makeRequest(`user-service/create-profile`, data, "POST");
  }

  async getAllAnnouncements() {
    return this.makeRequest(`announcement-service`, null, "GET");
  }
}

const api = new Api("apiKey");

export default api;
