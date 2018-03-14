import React, { Component, PropTypes } from "react";
import Dimensions from "Dimensions";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from "react-native";

import UserInput from "../Shared/UserInput";
import PasswordInputField from "../Shared/PasswordInputField";
import SignupSection from "../Login/SignupSection";

import usernameImg from "../../Images/username.png";
import passwordImg from "../../Images/password.png";
import eyeImg from "../../Images/eye_black.png";

export default class Form extends Component {
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
      <View style={styles.ipWrapper}>
        {this.props.icon ? (
          <Image source={this.props.source} style={styles.inlineImg} />
        ) : (
          <View />
        )}
        <TextInput
          style={[styles.input, this.props.icon ? styles.inputIcon : ""]}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor={appThemeColor.ipPlaceholderColor}
          placeholder={this.props.placeholder}
          underlineColorAndroid="transparent"
          autoCapitalize={"none"}
          returnKeyType={"done"}
      autoCorrect={false}
      value={this.props.value}
      keyboardType= {this.props.type}
        />
      </View>
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
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
	alignItems: 'center',
	// backgroundColor: 'yellow',
  },
  btnEye: {
    position: "absolute",
    bottom: 46,
    right: 28
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: "rgba(0,0,0,0.2)"
  },
  passwordIp: {
    marginVertical: 10
  }
});

// AppRegistry.registerComponent('AwesomeProject', () => Form);
