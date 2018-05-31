import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Alert,
  BackHandler,
  Image,
  TouchableOpacity
} from "react-native";
import { URL_CONFIG } from "../../AppUrlConfig";
import { appThemeColor } from "../../AppGlobalConfig";
import videoCallIcon from "../../images/make-call.png";
import LoadingIndicator from "../Shared/LoadingIndicator";
import { getUserConsultations } from "../../AppGlobalAPIs";

export default class DoctorSearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchtext: "",
      allDocData: [],
      isLoading: true
    };
    this.onClickSearchBtn = this.onClickSearchBtn.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    this.onClickSearchBtn();
    this.getActiveConsultations();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    this.props.navigation.navigate("specializationscreen");
    return true;
  }

  getActiveConsultations() {
    let loggedInUserIdPromise = storageServices.readMultiple([
      "loggedInUserId",
      "auth-api-key",
      "x-csrf-token"
    ]);

    loggedInUserPromise.then(value => {
      let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-api-key": JSON.parse(value[1]),
        "x-csrf-token": JSON.parse(value[2])
      };
      getUserConsultations(headers, JSON.parse(value[0]))
        .then(responseData => {
          console.log("getUserConsultations API Response: ", responseData);
        })
        .catch(error => {
          console.log("getUserConsultations Response Error: ", error);
        });
    });
  }

  onClickSearchBtn() {
    this.setState({ isLoading: true });
    setTimeout(_ => {
      this.setState({
        isLoading: false,
        allDocData: [
          {
            firstName: "Dr. Sam",
            lastName: "Son",
            location: "Hyderabad",
            mobileNumber: "9627517697",
            fcmToken:
              "dddxEZP33Q0:APA91bFjuYZO4vkOwDioM1OjIsSrziwYCSt2XD71xFDvOdeBinTVs2wTwTPSTrsO5u6kB7VZNXlgLVV5utbYG4tb5yPUTrAPelGEoWKdgIhEITeoq9t3ZqPMhCmdnnJh8o8cuvb4M1wn"
          },
          {
            firstName: "Dr. Mike",
            lastName: "Clark",
            location: "Hyderabad",
            mobileNumber: "8886389997",
            fcmToken:
              "eMH0Y_QV2ss:APA91bHz_9cL2h3U44pTe_1TLYq5KsN1Y0zmG7RYTxfqw2EJaVXTVgYXgJzyASkLpT8sFcWOPgdEfd8KMe-a4Gy8RixhwrlVcVkV1K8-a_SPB7jdolBmRLaSCorH4oPJXZDfYRjWpaBj"
          }
        ]
      });
    }, 2000);

    // fetch(
    //   URL_CONFIG.SEARCH_DOCTOR +
    //     this.props.navigation.state.params.specialization,
    //   {
    //     method: "GET",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json"
    //     }
    //   }
    // )
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     // console.log("Search criteria Reponse: ", responseJson);
    //     if (this.props.navigation.state.params.specialization == "GENERAL") {
    //       this.setState({
    //         isLoading: false,
    //         allDocData: [
    //           {
    //             firstName: "Dr. Sam",
    //             lastName: "Son",
    //             location: "Hyderabad",
    //             mobileNumber: "9627517697",
    //             fcmToken:
    //               "dddxEZP33Q0:APA91bFjuYZO4vkOwDioM1OjIsSrziwYCSt2XD71xFDvOdeBinTVs2wTwTPSTrsO5u6kB7VZNXlgLVV5utbYG4tb5yPUTrAPelGEoWKdgIhEITeoq9t3ZqPMhCmdnnJh8o8cuvb4M1wn"
    //           },
    //           {
    //             firstName: "Dr. Mike",
    //             lastName: "Clark",
    //             location: "Hyderabad",
    //             mobileNumber: "8886389997",
    //             fcmToken:
    //               "eMH0Y_QV2ss:APA91bHz_9cL2h3U44pTe_1TLYq5KsN1Y0zmG7RYTxfqw2EJaVXTVgYXgJzyASkLpT8sFcWOPgdEfd8KMe-a4Gy8RixhwrlVcVkV1K8-a_SPB7jdolBmRLaSCorH4oPJXZDfYRjWpaBj"
    //           }
    //         ]
    //       });
    //     } else {
    //       responseJson.forEach(element => {
    //         element.fcmToken = element.notificationId
    //       });
    //       this.setState({ isLoading: false, allDocData: responseJson });
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  }


  render() {
    return (
      <View>
        {/* <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchTextInput}
            onChangeText={searchtext => this.setState({ searchtext })}
            placeholder="Type here to search Doctor by name!"
            returnKeyLabel={"next"}
            underlineColorAndroid="rgba(0,0,0,0)"
          />
          <Button
            style={styles.searchButton}
            onPress={this.onClickSearchBtn}
            title="Search"
            color={appThemeColor.btnBgColor}
            accessibilityLabel="Search"
          />
        </View> */}
        {this.state.isLoading ? <LoadingIndicator /> : null}
        <ScrollView style={styles.searchResultsContainer}>
          <FlatList
            data={this.state.allDocData}
            renderItem={({ item }) => (
              <DoctorSearchDetailComponent
                docDetail={item}
                props={this.props}
              />
            )}
            keyExtractor={(item, index) => index}
          />
        </ScrollView>
      </View>
    );
  }
}

class DoctorSearchDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedItem: null
    };
    // console.log("DoctorSearchDetailComponent props: ", props);
    this.onClickCallBtn = this.onClickCallBtn.bind(this);
  }

  onClickCallBtn(value) {

    let data = JSON.stringify(value);
    this.props.props.navigation.navigate("outgoingcallscreen", {
      userSelected: data
    });
  }

  render() {
    return (
      <View style={styles.doctorDetailsOuterContainer}>
        <View style={styles.doctorDetailsContainer}>
          <Text style={styles.doctorDetailsIcon}>
            {this.props.docDetail.firstName.charAt(0).toUpperCase() +
              this.props.docDetail.lastName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.doctorDetailsMain}>
          <Text style={styles.doctorDetailsMainDesc}>
            First Name: {this.props.docDetail.firstName}
          </Text>
          <Text style={styles.doctorDetailsMainDesc}>
            Last Name: {this.props.docDetail.lastName}
          </Text>
          <Text style={styles.doctorDetailsMainDesc}>
            Mobile Number: {this.props.docDetail.mobileNumber}
          </Text>
        </View>
        <View style={styles.doctorDetailsVideoContainer}>
          <TouchableOpacity
            onPress={this.onClickCallBtn.bind(this, this.props.docDetail)}
          >
            <Image
              source={videoCallIcon}
              style={styles.doctorDetailsVideoIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10,
    marginTop: 10
  },
  searchTextInput: {
    height: 40,
    marginHorizontal: 10,
    flex: 1,
    paddingLeft: 10,
    borderRadius: 4,
    color: appThemeColor.color,
    backgroundColor: appThemeColor.ipBgColor
  },
  searchButton: { margin: 10 },
  searchResultsContainer: { marginBottom: 40 },
  doctorDetailsOuterContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
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
  doctorDetailsContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  doctorDetailsIcon: {
    height: 50,
    width: 50,
    backgroundColor: appThemeColor.btnBgColor,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 200,
    marginLeft: 15,
    alignItems: "center",
    paddingTop: 11
  },
  doctorDetailsMain: {
    flex: 1,
    flexDirection: "column",
    marginTop: 15,
    marginBottom: 15
  },
  doctorDetailsMainDesc: { marginLeft: 16 },
  doctorDetailsVideoContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10
  },
  doctorDetailsVideoIcon: { height: 40, width: 40 }
});
