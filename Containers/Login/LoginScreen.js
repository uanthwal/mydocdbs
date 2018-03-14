import React, { Component, PropTypes } from "react";
import Logo from "../Login/Logo";
import Form from "../Login/Form";
import Wallpaper from "../Login/Wallpaper";
import SignupSection from "../Login/SignupSection";
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
  Keyboard
} from "react-native";
import spinner from "../../Images/loader_new.gif";
import { appThemeColor } from "../../AppGlobalConfig";
import Dimensions from "Dimensions";
import passwordImg from "../../Images/password.png";
import eyeImg from "../../Images/eye_black.png";
import usernameImg from "../../Images/username.png";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const MARGIN = 40;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      username: "",
      password: ""
    };
    const nav = this.props.nav;
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onClickLoginBtn = this._onClickLoginBtn.bind(this);
    console.ignoredYellowBox = ["Setting a timer"];
  }

  _onClickLoginBtn() {
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
      fetch("https://mydoc-backend.herokuapp.com/mydoc/users/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // mobileNumber: this.state.username,
          // password: this.state.password,
          mobileNumber: "123456789",
          password: "password123"
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.code == 0) {
            console.log(responseJson);
            this.setState({ userId: responseJson.data });
            this.props.navigation.navigate("drawerStack");
          } else {
          }
          this.setState({ isLoading: false });
          this.buttonAnimated.setValue(0);
          this.growAnimated.setValue(0);
        })
        .catch(error => {
          console.error(error);
        });
      //   this.setState({ isLoading: false });
      //   this.buttonAnimated.setValue(0);
      //   this.growAnimated.setValue(0);
    }, 0);
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear
    }).start();
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
      <View style={styles.wallpaper}>
        <Logo />
        <View style={styles.ipWrapper}>
          <Image source={usernameImg} style={styles.inlineImg} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            returnKeyLabel={"next"}
            underlineColorAndroid="rgba(0,0,0,0)"
            onChangeText={text => this.setState({ username: text })}
          />
        </View>
        <View style={styles.ipWrapper}>
          <Image source={passwordImg} style={styles.inlineImg} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            returnKeyLabel={"next"}
            underlineColorAndroid="rgba(0,0,0,0)"
            onChangeText={text => this.setState({ password: text })}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.container}>
          <Animated.View style={{ width: changeWidth }}>
            <TouchableOpacity
              style={styles.button}
              onPress={this._onClickLoginBtn}
              activeOpacity={1}
            >
              {this.state.isLoading ? (
                <Image source={spinner} style={styles.image} />
              ) : (
                <Text style={styles.text}>LOGIN</Text>
              )}
            </TouchableOpacity>
            <Animated.View
              style={[styles.circle, { transform: [{ scale: changeScale }] }]}
            />
          </Animated.View>
        </View>
        <View style={styles.userActionContainer}>
          <TouchableOpacity
            style={styles.useractionBtn}
            onPress={() => this.props.navigation.navigate("signupScreen")}
            activeOpacity={1}
          >
            <Text style={styles.actionBtnTxt}>Create account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.useractionBtn}
            onPress={this.navi}
            activeOpacity={1}
          >
            <Text style={styles.actionBtnTxt}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
// <Text>My initialProps are {JSON.stringify(this.props)}.</Text>
const styles = StyleSheet.create({
  wallpaper: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: appThemeColor.color
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
    // width: DEVICE_WIDTH,
    // backgroundColor:'black',
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appThemeColor.btnBgColor,
    height: MARGIN,
    borderRadius: 4,
    zIndex: 100,
    marginTop: 15
    // width: DEVICE_WIDTH/2
  },
  useractionBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    zIndex: 100
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: appThemeColor.color,
    borderRadius: 100,
    // alignSelf: 'center',
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
    paddingLeft: 40,
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
  inlineImg: {
    position: "absolute",
    zIndex: 99,
    width: 22,
    height: 22,
    left: 35,
    top: 9
  },
  userActionContainer: {
    flex: 1,
    top: 20,
    width: DEVICE_WIDTH,
    flexDirection: "row",
    justifyContent: "space-around",
    zIndex: 99999
  },
  actionBtnTxt: {
    color: appThemeColor.textColorTheme,
    backgroundColor: "transparent"
  }
});
