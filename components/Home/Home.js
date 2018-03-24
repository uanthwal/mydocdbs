import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  BackHandler
} from "react-native";
import GridView from "react-native-super-grid";
import { appThemeColor } from "../../AppGlobalConfig";
// import DoctorConnectScreen from "../DoctorConnect/DoctorConnect";

// import SideMenu from "react-native-side-menu";
// import Menu from "../common-components/Menu";

// const image = require("../../images/eye_black.png");

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
      selectedItem: "About"
    };
    this._handleBackButton = this._handleBackButton.bind(this);
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
    return false;
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

  render() {
    const iconPath = "../../images/icon/";
    const categories = [
      {
        icon: require("../../images/icon/search_doctor.png"),
        label: "Search Doctor",
        page: "doctorsearchscreen"
      },
      {
        icon: require("../../images/icon/connect.png"),
        label: "Doctor Connect",
        page: "doctorconnectscreen"
      },
      {
        icon: require("../../images/icon/search_patient.png"),
        label: "Search Patient",
        page: ""
      },
      {
        icon: require("../../images/icon/chatbot.png"),
        label: "Chat Bot",
        page: ""
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
        page: ""
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

    return (
      <View style={[styles.container]}>
        <GridView
          itemDimension={100}
          items={categories}
          style={styles.gridView}
          renderItem={item => (
            <View style={[styles.itemContainer, styles.iosCard]}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => this.props.navigation.navigate(item.page)}
                activeOpacity={1}
              >
                <Image source={item.icon} style={styles.itemImg} />
                <Text style={styles.itemName}>{item.label}</Text>
              </TouchableOpacity>
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
