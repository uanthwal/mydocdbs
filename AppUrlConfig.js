export var URL_CONFIG = {
  BASE_URL: "https://mydoc-backend.herokuapp.com/mydoc",
  LOGIN_URL: "/users/login",
  REGISTER_USER: "/users/register",
  ADD_PATIENT: "/patient/add",
  SEARCH_DOCTOR:
    "http://ec2-13-127-204-4.ap-south-1.compute.amazonaws.com:8080/api/doctor/",
  UPDATE_NOTIFICATION_ID: "/users/updateNotificationId",
  GET_USER_NOTIFICATION_ID: "/users/updateNotificationId",
  SEND_NOTIFICATION_TO_DEVICE: "https://fcm.googleapis.com/fcm/send",
  LEGACY_SERVER_KEY: "AIzaSyBzCWYCJVxySLEECioJvPjZmJA9kr3Zar0", // Get this key from the Project settings > Cloud messaging tab
  GET_ACTIVE_CONSULTATIONS:
    "/users/getConsultationDetailsForUser/?mobileNumber=",
  CREATE_CONSULTATION: "/users/createConsultation",
  GET_ALL_PATIENTS: "/patient/getallpatient",
  UPDATE_CONSULTATION: "/patient/updateConsultationDetail",
  UPLOAD_ATTACHMENTS: "/patient/uploadDoc",
};
