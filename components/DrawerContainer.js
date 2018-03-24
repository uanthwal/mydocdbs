import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableHighlight
} from "react-native";
import { NavigationActions } from "react-navigation";

import aboutusIcon from "../images/about-us.png";
import connectIcon from "../images/icon/connect.png";
import rateusIcon from "../images/rate-us.png";
import logoutIcon from "../images/logout.png";
import homeIcon from "../images/home.png";
import profileIcon from "../images/profile.png";
import { appThemeColor } from "../AppGlobalConfig";

export default class DrawerContainer extends React.Component {
  logout = () => {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: "loginStack" })]
    });
    AsyncStorage.clear();
    this.props.navigation.dispatch(actionToDispatch);
  };

  render() {
    const { navigation } = this.props;
    const highLightColor = appThemeColor.highLightColor;
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={() => navigation.navigate("homescreen")}
          underlayColor={highLightColor}
        >
          <View style={styles.drawerItem}>
            <Image source={homeIcon} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Home</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => navigation.navigate("profilescreen")}
          underlayColor={highLightColor}
        >
          <View style={styles.drawerItem}>
            <Image source={profileIcon} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>My Profile</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => navigation.navigate("ratingscreen")}
          underlayColor={highLightColor}
        >
          <View style={styles.drawerItem}>
            <Image source={rateusIcon} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Rate us</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => navigation.navigate("aboutscreen")}
          underlayColor={highLightColor}
        >
          <View style={styles.drawerItem}>
            <Image source={aboutusIcon} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>About us</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.logout} underlayColor={highLightColor}>
          <View style={styles.drawerItem}>
            <Image source={logoutIcon} style={styles.drawerItemIcon} />
            <Text style={styles.drawerItemText}>Logout</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6"
  },
  drawerItem: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1
  },
  drawerItemIcon: {
    height: 40,
    width: 40
  },
  drawerItemText: {
    marginLeft: 8,
    fontSize: 20
  }
});
