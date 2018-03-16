import React from "react";
import { Text, Animated, Easing, Image, TouchableOpacity } from "react-native";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import LoginScreen from "../Containers/Login/LoginScreen";
import SignupScreen from "../Containers/Signup/SignUp";
import ForgottenPasswordScreen from "../Containers/ForgottenPasswordScreen";
import HomeScreen from "../Containers/Home/Home";
import ProfileScreen from "../Containers/Profile/Profile";
import RatingScreen from "../Containers/Rating/Rating";
import AboutScreen from "../Containers/About/About";
import ScanUploadScreen from "../Containers/ScanUpload/ScanUploadScreen";
import AddPatientScreen from "../Containers/Patient/AddPatient";
import DoctorConnectScreen from "../Containers/DoctorConnect/DoctorConnect";

import Screen2 from "../Containers/Screen2";
import Screen3 from "../Containers/Screen3";
import DrawerContainer from "../Containers/DrawerContainer";
import { appThemeColor } from "../AppGlobalConfig";

import menuIcon from "../Images/menu.png";
import DoctorSearchScreen from "../Containers/Search/SearchDoctorScreen";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
});

// drawer stack
const DrawerStack = DrawerNavigator(
  {
    homescreen: { screen: HomeScreen, headerMode: "float" },
    profilescreen: { screen: ProfileScreen, headerMode: "float" },
    ratingscreen: { screen: RatingScreen, headerMode: "float" },
    aboutscreen: { screen: AboutScreen, headerMode: "float" }
    // doctorconnectscreen: {
    //   screen: DoctorConnectScreen,
    //   navigationOptions: { title: "Connect to Doctor" }
    // },
  },
  {
    gesturesEnabled: false,
    contentComponent: DrawerContainer
  }
);

const drawerButton = navigation => (
  <TouchableOpacity
    onPress={() => {
      if (navigation.state.index === 0) {
        navigation.navigate("DrawerOpen");
      } else {
        navigation.navigate("DrawerClose");
      }
    }}
    activeOpacity={1}
  >
    <Image source={menuIcon} style={{ height: 35, width: 35, marginLeft: 8 }} />
  </TouchableOpacity>
);

const DrawerNavigation = StackNavigator(
  {
    DrawerStack: { screen: DrawerStack }
  },
  {
    headerMode: "screen",
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: appThemeColor.btnBgColor, marginLeft: 0 },
      title: "MyDoc",
      headerTintColor: "white",
      gesturesEnabled: false,
      headerLeft: drawerButton(navigation)
    })
  }
);

// login stack
const LoginStack = StackNavigator(
  {
    loginScreen: { screen: LoginScreen },
    signupScreen: {
      screen: SignupScreen,
      navigationOptions: { title: "Create Account" }
    },
    forgottenPasswordScreen: {
      screen: ForgottenPasswordScreen,
      navigationOptions: { title: "Forgot Password" }
    }
  },
  {
    headerMode: "float",
    navigationOptions: {
      headerStyle: { backgroundColor: appThemeColor.btnBgColor },
      // title: 'You are not logged in',
      headerTintColor: "white"
    }
  }
);

const HomeStack = StackNavigator(
  {
    addpatientscreen: {
      screen: AddPatientScreen,
      headerMode: "none",
      navigationOptions: {
        title: "Add Patient",
        headerTitleStyle: {
          flex: 1,
          textAlign: "center"
        },
        headerLeft: null
      }
    },
    doctorconnectscreen: {
      screen: DoctorConnectScreen,
      navigationOptions: {
        title: "Connect to Doctor",
        headerTitleStyle: {
          flex: 1,
          textAlign: "center"
        },
        headerLeft: null
      }
    },
    doctorsearchscreen: {
      screen: DoctorSearchScreen,
      navigationOptions: {
        title: "Search Doctor",
        headerTitleStyle: {
          flex: 1,
          textAlign: "center"
        },
        headerLeft: null
      }
    }
  },
  {
    headerMode: "float",
    navigationOptions: {
      headerStyle: { backgroundColor: appThemeColor.btnBgColor },
      // title: "home stack",
      headerTintColor: "white"
    }
  }
);

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    loginStack: { screen: LoginStack },
    drawerStack: { screen: DrawerNavigation },
    homeStack: { screen: HomeStack }
  },
  {
    // Default config for all screens
    headerMode: "none",
    // title: "Main",
    initialRouteName: "loginStack",
    transitionConfig: noTransitionConfig
  }
);

export default PrimaryNav;
