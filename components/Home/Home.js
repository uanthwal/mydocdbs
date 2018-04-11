import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  TouchableHighlight,
  BackHandler
} from "react-native";
import GridView from "react-native-super-grid";
import { appThemeColor } from "../../AppGlobalConfig";
import FCM from "react-native-fcm";
import {
  registerKilledListener,
  registerAppListener
} from "../PushNotification/Listeners";
import firebaseClient from "../PushNotification/FirebaseClient";
import { login, updateFCMNotificationId } from "../../AppGlobalAPIs";
const storageServices = require("../Shared/Storage.js");

var SharedPreferences = require("react-native-shared-preferences");
registerKilledListener();

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      selectedItem: "Home"
    };
    this._handleBackButton = this._handleBackButton.bind(this);
  }
  componentDidMount() {
    // storageServices.save("prevNotificationId", "TEMP_VAL");
    BackHandler.addEventListener("hardwareBackPress", this._handleBackButton);
    registerAppListener(this.props.navigation);
    // FCM.getInitialNotification().then(notif => {
    //   console.log("Notification Received in getInitialNotification: ", notif);
    //   if (notif && notif.target_screen) {
    //     // if (notif.target_screen === "doctorconnectscreen") {
    //     //   console.log("Moving to incoming call screen");
    //     //   // setTimeout(() => {
    //     //   //   navigation.navigate("incomingcallscreen", {
    //     //   //     notificationData: JSON.stringify(
    //     //   //       notif.notification_data
    //     //   //     )
    //     //   //   });
    //     //   // }, 100);
    //     //   FCM.removeAllDeliveredNotifications();
    //     //   return;
    //     // }

    //     let prevNotificationPromise = storageServices.read(
    //       "prevNotificationId"
    //     );
    //     if (prevNotificationPromise) {
    //       prevNotificationPromise
    //         .then(value => {
    //           console.log(
    //             "fetching prevNotification value: ",
    //             JSON.parse(value)
    //           );
    //           if (value && JSON.parse(value)) {
    //             if (notif && notif.id != value && value != "TEMP_VAL") {
    //               storageServices.save("prevNotificationId", notif.id);
    //               if (notif.target_screen === "doctorconnectscreen") {
    //                 console.log("Moving to incoming call screen");
    //                 // setTimeout(() => {
    //                 //   navigation.navigate("incomingcallscreen", {
    //                 //     notificationData: JSON.stringify(
    //                 //       notif.notification_data
    //                 //     )
    //                 //   });
    //                 // }, 100);
    //                 return;
    //               }
    //             }
    //           }
    //         })
    //         .catch(function(error) {
    //           console.log(
    //             "There has been a problem with your fetch operation: " +
    //               error.message
    //           );
    //           // ADD THIS THROW error
    //           throw error;
    //         });
    //     }
    //   }
    // });
    // Get the device FCM Token
    FCM.getFCMToken()
      .then(token => {
        console.log("FCMToken: ", token);
        let loggedInUserIdPromise = storageServices.readMultiple([
          "loggedInUserId",
          "auth-api-key",
          "x-csrf-token"
        ]);
        loggedInUserIdPromise
          .then(value => {
            if (value != null) {
              //User is logged in
              let payload = {
                mobileNumber: JSON.parse(value[0]),
                notificationId: token
              };
              let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "auth-api-key": JSON.parse(value[1]),
                "x-csrf-token": JSON.parse(value[2])
              };
              updateFCMNotificationId(headers, payload)
                .then(responseData => {
                  // console.log(
                  //   "Update Notification ID Response: ",
                  //   responseData
                  // );
                  if (responseData.code == 0) {
                    // console.log("Notification ID updated!!");
                  } else {
                    // console.log("Error while updating the Notification ID!!");
                  }
                })
                .catch(error => {
                  console.log("Update Notification ID Response Error: ", error);
                });
            } else {
              // console.log(
              //   "HomeScreen: Error while updating Notification ID: ",
              //   error
              // );
            }
          })
          .catch(error => {
            console.log(
              "HomeScreen: Error while getting loggedInUserInfo",
              error
            );
          });

        storageServices.save("notificationToken", token);
      })
      .catch(error => {
        console.log("HomeScreen: In catch of getting the Token: ", error);
      });
    // let tokenPromise = storageServices.read("doctorconnectscreen");
    // if (tokenPromise) {
    //   tokenPromise
    //     .then(tokenValue => {
    //       console.log("fetching doctconnect value: ", JSON.parse(tokenValue));
    //       if (tokenValue && JSON.parse(tokenValue)) {
    //         storageServices.save("doctorconnectscreen", false);
    //         this.props.navigation.navigate("doctorconnectscreen", {
    //           callFrom: "userID"
    //         });
    //       }
    //     })
    //     .catch(function(error) {
    //       console.log(
    //         "There has been a problem with your fetch operation: " +
    //           error.message
    //       );
    //       // ADD THIS THROW error
    //       throw error;
    //     });
    // }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._handleBackButton
    );
  }

  _handleBackButton() {
    BackHandler.exitApp();
    // return false;
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item
    });

  render() {
    const iconPath = "../../images/icon/";
    const categories = [
      {
        icon: require("../../images/icon/search_doctor.png"),
        label: "Search Doctor",
        page: "specializationscreen"
      },
      {
        icon: require("../../images/icon/connect.png"),
        label: "Doctor Connect",
        page: "doctorconnectscreen"
      },
      {
        icon: require("../../images/icon/search_patient.png"),
        label: "Search Patient",
        page: ""
      },
      {
        icon: require("../../images/icon/chatbot.png"),
        label: "Chat Bot",
        page: "chatscreen"
      },
      {
        icon: require("../../images/icon/reports.png"),
        label: "My Reports",
        page: ""
      },
      {
        icon: require("../../images/icon/patient.png"),
        label: "Add Patient",
        page: "addpatientscreen"
      },
      {
        icon: require("../../images/icon/upload.png"),
        label: "Scan Upload",
        page: ""
      },
      {
        icon: require("../../images/icon/history.png"),
        label: "History",
        page: ""
      },
      {
        icon: require("../../images/icon/notifications.png"),
        label: "Notifications",
        page: "incomingcallscreen"
      }
    ];
    const highLightColor = appThemeColor.highLightColor;
    return (
      <View style={[styles.container]}>
        <GridView
          itemDimension={100}
          items={categories}
          style={styles.gridView}
          renderItem={item => (
            <View style={[styles.itemContainer, styles.iosCard]}>
              <TouchableHighlight
                style={styles.drawerItem}
                onPress={() => this.props.navigation.navigate(item.page)}
                underlayColor={highLightColor}
              >
                <View>
                  <Image source={item.icon} style={styles.itemImg} />
                  <Text style={styles.itemName}>{item.label}</Text>
                </View>
              </TouchableHighlight>
            </View>
          )}
        />
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    height: DEVICE_HEIGHT
  },
  gridView: {
    paddingTop: 10,
    paddingBottom: 25,
    flex: 1,
    backgroundColor: appThemeColor.screenBgColor
  },
  itemContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: 130
  },
  iosCard: {
    backgroundColor: "#f8f8f8",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    },
    elevation: 2
  },
  itemName: {
    fontSize: 16,
    color: appThemeColor.textColor,
    fontWeight: "600",
    height: 40
  },
  itemImg: {
    height: 80,
    width: 80
  },

  button: {
    position: "absolute",
    top: 20,
    padding: 10
  },
  caption: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
