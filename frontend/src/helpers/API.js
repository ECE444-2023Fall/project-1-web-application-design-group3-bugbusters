import axios, { AxiosError } from "axios";
// import * as SecureStore from "expo-secure-store";

export class Api {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.url = process.env.EXPO_PUBLIC_BASE_API_URL;
  }

  async makeRequest(endpoint, data, method, params) {
    const result = {
      result: null,
      data: null,
    };

    const response = await axios({
      method: method,
      url: `${this.url}/${endpoint}`,
      data: data,
      params: params,
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
    return this.makeRequest("user-service/create-profile", data, "POST");
  }

  async editUserProfile(data) {
    return this.makeRequest(`user-service/edit-profile`, data, "PUT");
  }

  async createEvent(data) {
    return this.makeRequest("/event-service/create-event", data, "POST");
  }

  async editEvent(data, id) {
    return this.makeRequest(`/event-service/edit-event/${id}`, data, "PUT");
  }

  async search(data) {
    return this.makeRequest("search-service/search", data, "POST");
  }

  async deleteEventfromSearch(id) {
    return this.makeRequest(
      `search-service/delete`,
      { objectID: id },
      "DELETE",
    );
  }

  async deleteEvent(id) {
    return this.makeRequest(`event-service/delete-event/${id}`, null, "DELETE");
  }

  async report(id) {
    // always set reported to true
    return this.makeRequest(
      `report-service/report/${id}`,
      { report: true },
      "POST",
    );
  }
  async rsvp(data) {
    return this.makeRequest("event-service/rsvp", data, "PUT");
  }

  async sendRsvp(data) {
    return this.makeRequest("event-service/rsvp-send", data, "POST");
  }

  async getAllAnnouncements() {
    return this.makeRequest(`announcement-service`, null, "GET");
  }

  async createAnnouncement({ description }) {
    return this.makeRequest(
      `announcement-service`,
      {
        description: description,
      },
      "POST",
    );
  }

  async deleteAnnouncement(id) {
    query_params = { id: id };
    return this.makeRequest(
      `announcement-service`,
      null,
      "DELETE",
      query_params,
    );
  }

  async editAnnouncement({ description, id }) {
    data = { description: description };
    query_params = {
      id: id,
    };
    return this.makeRequest(`announcement-service`, data, "PUT", query_params);
  }
}

const api = new Api("apiKey");

export default api;
