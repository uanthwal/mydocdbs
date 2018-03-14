import React, { Component, PropTypes } from "react";
import { StyleSheet, ImageBackground } from "react-native";

import bgSrc from "../../Images/wallpaper.png";
import { appThemeColor } from "../../AppGlobalConfig";

export default class Wallpaper extends Component {
  render() {
    return (
      <ImageBackground style={styles.picture} >
        {this.props.children}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor:appThemeColor.color,
  }
});
// AppRegistry.registerComponent("AwesomeProject", () => Wallpaper);
