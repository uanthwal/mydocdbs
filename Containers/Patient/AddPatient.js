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
  RadioButton,
  Keyboard
} from "react-native";
import spinner from "../../Images/loader_new.gif";
import { appThemeColor } from "../../AppGlobalConfig";
import Dimensions from "Dimensions";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const MARGIN = 40;

export default class AddPatientScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this.state.gender = "male";
  }

  _onPress() {
    if (this.state.isLoading) return;
    Keyboard.dismiss();
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
        mobileNumber: this.state.mobileNumber,
        location: this.state.city,
        addedBy: this.state.userId,
        age: this.state.age,
        gender: this.state.gender
      };
      console.log(payload);
      fetch("https://mydoc-backend.herokuapp.com/mydoc/patient/add", {
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

  onClickGender(data) {
    console.log(data);
    this.setState({ gender: data });
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
            placeholder="First Name"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ firstName: text })}
          />
        </View>

        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ lastName: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="numeric"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ mobileNumber: text })}
          />
        </View>

        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Age"
            returnKeyLabel={"next"}
            keyboardType="numeric"
            onChangeText={text => this.setState({ age: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <TextInput
            style={styles.input}
            placeholder="City"
            returnKeyLabel={"next"}
            onChangeText={text => this.setState({ city: text })}
          />
        </View>
        <View style={styles.roleView}>
          <Text style={styles.roleTextHeader}>Select Gender: </Text>
          <TouchableOpacity onPress={() => this.onClickGender("male")}>
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
                {this.state.gender === "male" ? (
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
              <Text>Male</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onClickGender("female")}>
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
                {this.state.gender === "female" ? (
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
              <Text>Female</Text>
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
