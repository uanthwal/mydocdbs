import React, { Component, PropTypes } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Image,
  Alert,
  View,
  AppRegistry,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  RadioButton
} from "react-native";
import spinner from "../../Images/loader_new.gif";
import { appThemeColor } from "../../AppGlobalConfig";
import Dimensions from "Dimensions";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const MARGIN = 40;

export default class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this.state.userRole = "healthworker";
  }

  _onPress() {
    if (this.state.isLoading) return;

    this.setState({ isLoading: true });
    Animated.timing(this.buttonAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear
    }).start();

    setTimeout(() => {
      this._onGrow();
    }, 2000);

    setTimeout(() => {
      let payload = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        password: this.state.lastName,
        emailId: this.state.email,
        mobileNumber: this.state.mobileNumber,
        userType: this.state.userRole,
        practiceId: this.state.userId
      };
      console.log(payload);
      fetch("https://mydoc-backend.herokuapp.com/mydoc/users/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
        })
        .catch(error => {
          console.error(error);
        });
      this.setState({ isLoading: false });
      this.buttonAnimated.setValue(0);
      this.growAnimated.setValue(0);
    }, 2300);
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear
    }).start();
  }

  onClickUserRole(data) {
    this.setState({ userRole: data });
  }
  render() {
    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN]
    });
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN]
    });
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="User Id"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ userId: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="firstName"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ firstName: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="lastName"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ lastName: text })}
          />
        </View>

        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ password: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ email: text })}
          />
        </View>

        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            returnKeyLabel={"next"}
            keyboardType="numeric"
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
              <View
                style={[
                  {
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#9eacb4",
                    alignItems: "center",
                    justifyContent: "center"
                  }
                ]}
              >
                {this.state.userRole === "healthworker" ? (
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      borderRadius: 6,
                      backgroundColor: "#ffffff"
                    }}
                  />
                ) : null}
              </View>
              <Text>Health Worker</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onClickUserRole("doctor")}>
            <View
              style={{ flexDirection: "row", marginBottom: 5, marginTop: 5 }}
            >
              <View
                style={[
                  {
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#9eacb4",
                    alignItems: "center",
                    justifyContent: "center"
                  }
                ]}
              >
                {this.state.userRole === "doctor" ? (
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      borderRadius: 6,
                      backgroundColor: "#ffffff"
                    }}
                  />
                ) : null}
              </View>
              <Text>Doctor</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.actionbtn, styles.container]}>
          <Animated.View style={{ width: changeWidth }}>
            <TouchableOpacity
              style={styles.button}
              onPress={this._onPress}
              activeOpacity={1}
            >
              {this.state.isLoading ? (
                <Image source={spinner} style={styles.image} />
              ) : (
                <Text style={styles.text}>SAVE</Text>
              )}
            </TouchableOpacity>
            <Animated.View
              style={[styles.circle, { transform: [{ scale: changeScale }] }]}
            />
          </Animated.View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  actionbtn:{
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
    zIndex: 100
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: appThemeColor.color,
    borderRadius: 100,
    zIndex: 99,
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
  }
});
