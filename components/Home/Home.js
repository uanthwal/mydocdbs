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
      selectedItem: "Home",
      userRole: null
    };
    this._handleBackButton = this._handleBackButton.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackButton);
    registerAppListener(this.props.navigation);
    // Get the device FCM Token
    FCM.getFCMToken()
      .then(token => {
        console.log("FCMToken: ", token);
        let loggedInUserIdPromise = storageServices.readMultiple([
          "loggedInUserId",
          "auth-api-key",
          "x-csrf-token",
          "loggedInUserData"
        ]);
        loggedInUserIdPromise
          .then(value => {
            if (value != null) {
              //User is logged in
              // console.log("loggedInUserIdPromise: ", value);
              this.setState({ userRole: JSON.parse(value[3])["userType"] });
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
                  if (responseData.code == 0) {
                    // console.log("Notification ID updated!!");
                  } else {
                    // console.log("Error while updating the Notification ID!!");
                  }
                })
                .catch(error => {
                  console.log("Update Notification ID Response Error: ", error);
                });
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

  getCategories(userRole) {
    if (userRole == "doctor")
      return [
        {
          icon: require("../../images/icon/connect.png"),
          label: "Patient Connect",
          page: "doctorconnectscreen"
        },
        {
          icon: require("../../images/icon/search_patient.png"),
          label: "Search Patient",
          page: "patientsearchscreen"
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
          icon: require("../../images/icon/upload.png"),
          label: "Scan Upload",
          page: "scanuploadscreen"
        },
        {
          icon: require("../../images/icon/history.png"),
          label: "History",
          page: ""
        },
        {
          icon: require("../../images/icon/notifications.png"),
          label: "Notifications",
          page: ""
        }
      ];
    else
      return [
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
          page: "patientsearchscreen"
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
          page: "scanuploadscreen"
        },
        {
          icon: require("../../images/icon/history.png"),
          label: "History",
          page: ""
        },
        {
          icon: require("../../images/icon/notifications.png"),
          label: "Notifications",
          page: ""
        }
      ];
  }
  render() {
    const iconPath = "../../images/icon/";
    const categories = this.getCategories(this.state.userRole);
    if (this.state.userRole == "healthWorker") {
    } else {
    }

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
