import React, { Component, PropTypes } from "react";
import Dimensions from "Dimensions";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";

import UserInput from "../Shared/UserInput";

import passwordImg from "../../images/password.png";
import eyeImg from "../../images/eye_black.png";

export default class PasswordInputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false
    };
    this.showPass = this.showPass.bind(this);
  }

  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <UserInput
          source={passwordImg}
          secureTextEntry={this.state.showPass}
          placeholder="Password"
          returnKeyType={"done"}
          autoCapitalize={"none"}
          autoCorrect={false}
          icon ={true}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnEye}
          onPress={this.showPass}
        >
          <Image source={eyeImg} style={styles.iconEye} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  btnEye: {
    position: "absolute",
    bottom: Platform.OS === 'ios' ? 55 : 47,
    right: 28
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: "rgba(0,0,0,0.2)"
  }
});

// AppRegistry.registerComponent('AwesomeProject', () => Form);
