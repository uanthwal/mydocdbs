import { URL_CONFIG } from "./AppUrlConfig";

export function login(data) {
  return fetch(URL_CONFIG.BASE_URL + URL_CONFIG.LOGIN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    });
}

export function registerUser(data) {
  return fetch(URL_CONFIG.BASE_URL + URL_CONFIG.REGISTER_USER, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    });
}

export function registerPatient(data) {
  return fetch(URL_CONFIG.BASE_URL + URL_CONFIG.ADD_PATIENT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    });
}