import { URL_CONFIG } from "./AppUrlConfig";
const storageServices = require("./components/Shared/Storage.js");

export function login(data) {
  return fetch(URL_CONFIG.BASE_URL + URL_CONFIG.LOGIN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => {
    // console.log(response.headers);
    // console.log(response.headers.map["auth-api-key"]);
    // console.log(response.headers.map["auth-api-key"][0]);
    storageServices.save(
      "auth-api-key",
      response.headers.map["auth-api-key"][0]
    );
    storageServices.save(
      "x-csrf-token",
      response.headers.map["x-csrf-token"][0]
    );
    return response.json();
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

export async function registerPatient(data) {
  return fetch(URL_CONFIG.BASE_URL + URL_CONFIG.ADD_PATIENT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "auth-api-key": await storageServices.read("auth-api-key"),
      "x-csrf-token": await storageServices.read("x-csrf-token")
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    });
}

export function updateFCMNotificationId(headers, data) {
  return fetch(URL_CONFIG.BASE_URL + URL_CONFIG.UPDATE_NOTIFICATION_ID, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseJson => {
      // console.log("updateFCMNotificationId", responseJson);
      return responseJson;
    })
    .catch(error => {
      console.log("Error while updating updateFCMNotificationId", error);
    });
}

export function sendNotificationViaFCM(calleeToken, data) {
  return fetch(URL_CONFIG.SEND_NOTIFICATION_TO_DEVICE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "key=" + URL_CONFIG.LEGACY_SERVER_KEY
    },
    body: JSON.stringify({
      to: calleeToken,
      data: {
        testdata:'testdata',
        custom_notification: {
          target_screen: "doctorconnectscreen",
          notification_data: data,
          body: data.callFromData.name,
          title: "Incoming Video Call",
          color: "#00ACD4",
          priority: "high",
          icon: "ic_notif",
          group: "GROUP",
          sound: "default",
          id: data.callRoomID,
          show_in_foreground: false
        }
      }
    })
  })
    .then(responseJson => {
      // console.log("sendNotificationViaFCM Response: ", responseJson);
      return responseJson;
    })
    .catch(error => {
      console.log("Error while sending sendNotificationViaFCM: ", error);
    });
}
