import React, { Component, PropTypes } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  View,
  TextInput,
  ScrollView,
  BackHandler,
  Keyboard
} from "react-native";
import LoadingIndicator from "../Shared/LoadingIndicator";
import { appThemeColor } from "../../AppGlobalConfig";
import Dimensions from "Dimensions";
import { URL_CONFIG } from "../../AppUrlConfig";
import { registerUser } from "../../AppGlobalAPIs";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const MARGIN = 40;

export default class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };

    this._onClickSave = this._onClickSave.bind(this);
    this._handleBackButton = this._handleBackButton.bind(this);
    this.state.userRole = "healthworker";
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._handleBackButton
    );
  }

  _handleBackButton() {
    if (this.state.isLoading) {
      return true;
    }
    this.props.navigation.navigate("loginStack");
    return true;
  }

  onClickOK(alertId) {
    if (alertId == "success") {
      //console.log("onclickok success case called");
      this.props.navigation.navigate("loginStack");
    } else {
      //console.log("onclickok else case called");
    }
  }

  displayAlert(alertId, title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: "OK",
          onPress: () => {
            this.onClickOK(alertId);
          }
        }
      ],
      { cancelable: false }
    );
  }

  _onClickSave() {
    Keyboard.dismiss();
    if (this.state.isLoading) return;

    let firstName =
      this.state.firstName != undefined ? this.state.firstName.trim() : null;
    let lastName =
      this.state.lastName != undefined ? this.state.lastName.trim() : null;
    let email = this.state.email != undefined ? this.state.email.trim() : null;
    let password =
      this.state.password != undefined ? this.state.password.trim() : null;
    let mobileNumber =
      this.state.mobileNumber != undefined
        ? this.state.mobileNumber.trim()
        : null;
    let userId =
      this.state.userId != undefined ? this.state.userId.trim() : null;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !mobileNumber ||
      !userId ||
      mobileNumber.length != 10
    ) {
      this.displayAlert(
        "failed",
        "Information Missing",
        "Please enter all the values!!"
      );
      return;
    }
    this.setState({ isLoading: true });
    let payload = {
      firstName: firstName,
      lastName: lastName,
      password: lastName,
      emailId: email,
      mobileNumber: mobileNumber,
      userType: this.state.userRole,
      practiceId: userId
    };

    registerUser(payload)
      .then(responseData => {
        // console.log("Register user API Response: ", responseData);
        if (responseJson.code == 0) {
          this.displayAlert(
            "success",
            "Success",
            "User registered successfully!!"
          );
        } else {
          this.displayAlert("failed", "Failed", "Failed to register user!!");
        }
        //console.log(responseJson);
        this.setState({ isLoading: false });
      })
      .catch(error => {
        // console.log("Register user Response Error: ", error);
        this.displayAlert("Network Error", appMessages.networkErr);
        this.setState({ isLoading: false });
      });
  }

  onClickUserRole(data) {
    this.setState({ userRole: data });
  }

  render() {
    return (
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {this.state.isLoading ? <LoadingIndicator /> : null}
        <View
          style={styles.ipWrapper}
          pointerEvents={this.state.isLoading ? "none" : "auto"}
        >
          <TextInput
            style={styles.input}
            placeholder="User Id"
            returnKeyLabel={"Next"}
            onSubmitEditing={event => {
              this.refs.firstName.focus();
            }}
            onChangeText={text => this.setState({ userId: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <TextInput
            ref="firstName"
            style={styles.input}
            placeholder="First Name"
            returnKeyLabel={"Next"}
            onSubmitEditing={event => {
              this.refs.lastName.focus();
            }}
            onChangeText={text => this.setState({ firstName: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <TextInput
            ref="lastName"
            style={styles.input}
            placeholder="Last Name"
            returnKeyLabel={"Next"}
            onSubmitEditing={event => {
              this.refs.password.focus();
            }}
            onChangeText={text => this.setState({ lastName: text })}
          />
        </View>

        <View style={styles.ipWrapper}>
          <TextInput
            ref="password"
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            returnKeyLabel={"Next"}
            onSubmitEditing={event => {
              this.refs.emailAdd.focus();
            }}
            onChangeText={text => this.setState({ password: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <TextInput
            ref="emailAdd"
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            returnKeyLabel={"Next"}
            onSubmitEditing={event => {
              this.refs.mobileNumber.focus();
            }}
            onChangeText={text => this.setState({ email: text })}
          />
        </View>

        <View style={styles.ipWrapper}>
          <TextInput
            ref="mobileNumber"
            style={styles.input}
            placeholder="Mobile Number"
            returnKeyLabel={"Next"}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={text => this.setState({ mobileNumber: text })}
          />
        </View>
        <View style={styles.roleView}>
          <Text style={styles.roleTextHeader}>Select Role: </Text>
          <TouchableOpacity
            onPress={() => this.onClickUserRole("healthworker")}
          >
            <View
              style={{ flexDirection: "row", marginBottom: 5, marginTop: 5 }}
            >
              <View style={styles.radioOuter}>
                {this.state.userRole === "healthworker" ? (
                  <View style={styles.radioInner} />
                ) : null}
              </View>
              <Text style={styles.radioLabel}>Health Worker</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onClickUserRole("doctor")}>
            <View
              style={{ flexDirection: "row", marginBottom: 5, marginTop: 5 }}
            >
              <View style={styles.radioOuter}>
                {this.state.userRole === "doctor" ? (
                  <View style={styles.radioInner} />
                ) : null}
              </View>
              <Text style={styles.radioLabel}>Doctor</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.actionbtn, styles.container]}>
          <TouchableOpacity
            style={styles.button}
            onPress={this._onClickSave}
            activeOpacity={1}
          >
            <Text style={styles.text}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  actionbtn: {
    marginTop: 20
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appThemeColor.btnBgColor,
    height: MARGIN,
    borderRadius: 4,
    zIndex: 2,
    width: DEVICE_WIDTH - MARGIN
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: appThemeColor.color,
    borderRadius: 100,
    zIndex: 1,
    backgroundColor: appThemeColor.color
  },
  text: {
    color: appThemeColor.btnTextColor
  },
  image: {
    width: 40,
    height: 40
  },
  input: {
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 20,
    borderRadius: 4,
    color: appThemeColor.color,
    backgroundColor: appThemeColor.ipBgColor
  },
  inputIcon: {
    paddingLeft: 45
  },
  ipWrapper: {
    height: 40,
    backgroundColor: appThemeColor.color,
    marginVertical: 10
  },
  scrollView: {
    height: DEVICE_HEIGHT,
    backgroundColor: appThemeColor.screenBgColor
  },
  roleView: {
    marginTop: 10,
    marginHorizontal: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 4,
    backgroundColor: appThemeColor.ipBgColor,
    width: DEVICE_WIDTH - 40
  },
  roleTextHeader: {
    color: appThemeColor.textColorWhite,
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  roleText: {
    color: appThemeColor.textColorWhite,
    paddingLeft: 10
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9eacb4",
    alignItems: "center",
    justifyContent: "center"
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#ffffff"
  },
  radioLabel: {
    color: "white",
    paddingLeft: 5
  }
});
