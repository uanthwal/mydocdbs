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
  TouchableOpacity,
  Modal,
  Picker,
  Dimensions
} from "react-native";
import { URL_CONFIG } from "../../AppUrlConfig";
import { appThemeColor } from "../../AppGlobalConfig";
import videoCallIcon from "../../images/make-call.png";
import LoadingIndicator from "../Shared/LoadingIndicator";
import { getUserConsultations } from "../../AppGlobalAPIs";
import { getAllPatientsList } from "../../AppGlobalAPIs";
import arrowDwnIcon from "../../images/arrow-down.png";
import arrowUpIcon from "../../images/arrow-up.png";
import selectedIcon from "../../images/selected.png";
import { createConsultation } from "../../AppGlobalAPIs";
import { updateConsultation } from "../../AppGlobalAPIs";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const storageServices = require("../Shared/Storage.js");

export default class DoctorSearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchtext: "",
      allDocData: [],
      isLoading: true,
      consultationsData: [],
      displayConsultationModal: false,
      allPatientsData: [],
      patientIdSelected: "-1",
      showNewConsultationList: false,
      showExisitingConsultationList: false,
      pointOnNew: false,
      pointOnExisting: false
    };
    this.onClickSearchBtn = this.onClickSearchBtn.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.onClickCloseModal = this.onClickCloseModal.bind(this);
    this.onPatientSelection = this.onPatientSelection.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    this.onClickSearchBtn();
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

    loggedInUserIdPromise.then(value => {
      let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-api-key": JSON.parse(value[1]),
        "x-csrf-token": JSON.parse(value[2])
      };
      getUserConsultations(headers, JSON.parse(value[0]))
        .then(responseData => {
          console.log("getUserConsultations API Response: ", responseData);
          responseData.data.map(_ => {
            return (_.selected = false);
          });
          this.setState({ consultationsData: responseData.data });
          this.getAllPatientsInfo(headers);
        })
        .catch(error => {
          console.log("getUserConsultations Response Error: ", error);
        });
    });
  }

  getAllPatientsInfo(headers) {
    getAllPatientsList(headers)
      .then(responseData => {
        console.log("getAllPatientsInfo API Response: ", responseData);
        this.setState({ allPatientsData: responseData });
        this.setState({ isLoading: false });
      })
      .catch(error => {
        console.log("getAllPatientsInfo Response Error: ", error);
      });
  }

  onClickConsultationHeaders(value) {
    if (value == "NEW")
      this.setState({
        showNewConsultationList: !this.state.showNewConsultationList,
        showExisitingConsultationList: false
      });
    if (value == "EXISTING")
      this.setState({
        showExisitingConsultationList: !this.state
          .showExisitingConsultationList,
        showNewConsultationList: false
      });
  }

  onClickConsultation(value) {
    let tempConsultationData = this.state.consultationsData;
    tempConsultationData.forEach(element => {
      element.selected =
        value.consultationId == element.consultationId ? true : false;
    });
    this.setState({
      consultationsData: JSON.parse(JSON.stringify(tempConsultationData)),
      pointOnNew: false,
      pointOnExisting: true
    });
    let tempPatientsData = this.state.allPatientsData;
    tempPatientsData.forEach(element => {
      element.selected = false;
    });
    this.setState({
      allPatientsData: JSON.parse(JSON.stringify(tempPatientsData))
    });
  }

  onClickCloseModal() {
    this.setState({ displayConsultationModal: false });
  }

  onPatientSelection(value) {
    console.log("onPatientSelection: ", value);
    let tempConsultationData = this.state.consultationsData;
    tempConsultationData.forEach(element => {
      element.selected = false;
    });
    this.setState({
      consultationsData: JSON.parse(JSON.stringify(tempConsultationData))
    });
    let tempPatientsData = this.state.allPatientsData;
    tempPatientsData.forEach(element => {
      element.selected = element.id == value.id ? true : false;
    });
    this.setState({
      allPatientsData: JSON.parse(JSON.stringify(tempPatientsData)),
      pointOnNew: true,
      pointOnExisting: false
    });
  }

  onClickProceedBtn() {
    let flag = -1;
    this.state.consultationsData.forEach(element => {
      if (element.selected) {
        flag = 1;
      }
    });
    this.state.allPatientsData.forEach(element => {
      if (element.selected) {
        flag = 2;
      }
    });
    console.log("Flag Value: ", flag);
    if (
      (this.state.pointOnNew || this.state.pointOnExisting) &&
      (flag == 1 || flag == 2)
    ) {
      console.log("Proceed to call the doctor");
      let loggedInUserIdPromise = storageServices.readMultiple([
        "loggedInUserId",
        "auth-api-key",
        "x-csrf-token",
        "loggedInUserData"
      ]);

      loggedInUserIdPromise
        .then(value => {
          let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-api-key": JSON.parse(value[1]),
            "x-csrf-token": JSON.parse(value[2])
          };
          if (flag == 2) {
            let payload = {
              doctorId: this.state.docSelectedForCall.id,
              patientId: this.state.allPatientsData[
                this.state.allPatientsData.findIndex(_ => _.selected == true)
              ]["id"],
              healthWorkerId: JSON.parse(value[3])["practiceId"]
            };
            console.log("createConsultation Payload: ", payload);
            createConsultation(headers, payload)
              .then(response => {
                if (response.code == 0) {
                  console.log("createConsultation API Response: ", response);
                }
              })
              .catch(error => {
                console.log("createConsultation Response Error: ", error);
              });
          } else if (flag == 1) {
            let payload = {
              consultationId: this.state.consultationsData[
                this.state.consultationsData.findIndex(_ => _.selected == true)
              ]["consultationId"]
            };
            console.log("updateConsultation Payload: ", payload);
            updateConsultation(headers, payload)
              .then(response => {
                console.log("updateConsultation API Response: ", response);
                // if (response.code == 0) {
                //   console.log("updateConsultation API Response: ", response);
                // }
              })
              .catch(error => {
                console.log("updateConsultation Response Error: ", error);
              });
          }
        })
        .catch(error => {
          console.log("loggedInUserIdPromise Response Error: ", error);
        });

      // this.props.props.navigation.navigate("outgoingcallscreen", {
      //   userSelected: data
      // });
    }
  }

  onClickSearchBtn() {
    this.setState({ isLoading: true });
    setTimeout(_ => {
      this.setState({
        allDocData: [
          {
            id: "ABCD123",
            firstName: "Dr. Sam",
            lastName: "Son",
            location: "Hyderabad",
            mobileNumber: "9627517697",
            fcmToken:
              "dbsdddxEZP33Q0:APA91bFjuYZO4vkOwDioM1OjIsSrziwYCSt2XD71xFDvOdeBinTVs2wTwTPSTrsO5u6kB7VZNXlgLVV5utbYG4tb5yPUTrAPelGEoWKdgIhEITeoq9t3ZqPMhCmdnnJh8o8cuvb4M1wn"
          },
          {
            id: "ABCD123456",
            firstName: "Dr. Mike",
            lastName: "Clark",
            location: "Hyderabad",
            mobileNumber: "8886389997",
            fcmToken:
              "dbseMH0Y_QV2ss:APA91bHz_9cL2h3U44pTe_1TLYq5KsN1Y0zmG7RYTxfqw2EJaVXTVgYXgJzyASkLpT8sFcWOPgdEfd8KMe-a4Gy8RixhwrlVcVkV1K8-a_SPB7jdolBmRLaSCorH4oPJXZDfYRjWpaBj"
          }
        ]
      });
    }, 2000);
    this.getActiveConsultations();
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

  onUpdate = value => {
    console.log("docSelectedForCall: ", value);
    this.setState({ docSelectedForCall: value });
    this.setState({ displayConsultationModal: true });
  };

  render() {
    return (
      <View style={styles.mainView}>
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
        {this.state.displayConsultationModal ? (
          <Modal
            animationType="slide"
            transparent={false}
            onRequestClose={() => {
              this.onClickCloseModal();
            }}
          >
            <View style={styles.selectConView}>
              <Text style={styles.selectConTxtHeader}>
                Please select Consultation
              </Text>
            </View>
            <ScrollView style={styles.modalView}>
              <TouchableOpacity
                onPress={this.onClickConsultationHeaders.bind(this, "NEW")}
              >
                <View style={styles.sections}>
                  <Text style={styles.existingConTxtHeader}>
                    New Consultation:
                  </Text>
                  {this.state.pointOnNew ? (
                    <Image source={selectedIcon} style={styles.pointIcon} />
                  ) : null}

                  {!this.state.showNewConsultationList ? (
                    <Image source={arrowDwnIcon} style={styles.arrowIcon} />
                  ) : (
                    <Image source={arrowUpIcon} style={styles.arrowIcon} />
                  )}
                </View>
              </TouchableOpacity>
              {this.state.showNewConsultationList ? (
                <FlatList
                  data={this.state.allPatientsData}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.doctorDetailsOuterContainer}
                      onPress={this.onPatientSelection.bind(this, item)}
                    >
                      {item.selected ? (
                        <Image
                          source={selectedIcon}
                          style={styles.selectedIcon}
                        />
                      ) : null}
                      <View style={styles.doctorDetailsContainer}>
                        <Text style={styles.doctorDetailsIcon}>
                          {item.firstName.charAt(0).toUpperCase() +
                            item.lastName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.doctorDetailsMain}>
                        <Text style={styles.doctorDetailsMainDesc}>
                          Patient Name: {item.firstName} {item.lastName}
                        </Text>
                        <Text style={styles.doctorDetailsMainDesc}>
                          Mobile: {item.mobileNumber}
                        </Text>
                        <Text style={styles.doctorDetailsMainDesc}>
                          Location: {item.location}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index}
                />
              ) : null}

              <TouchableOpacity
                onPress={this.onClickConsultationHeaders.bind(this, "EXISTING")}
              >
                <View style={styles.sections}>
                  <Text style={styles.existingConTxtHeader}>
                    Existing Consultation(s):
                  </Text>
                  {this.state.pointOnExisting ? (
                    <Image source={selectedIcon} style={styles.pointIcon} />
                  ) : null}
                  {!this.state.showExisitingConsultationList ? (
                    <Image source={arrowDwnIcon} style={styles.arrowIcon} />
                  ) : (
                    <Image source={arrowUpIcon} style={styles.arrowIcon} />
                  )}
                </View>
              </TouchableOpacity>
              {this.state.showExisitingConsultationList ? (
                <FlatList
                  data={this.state.consultationsData}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.doctorDetailsOuterContainer}
                      onPress={this.onClickConsultation.bind(this, item)}
                    >
                      {item.selected ? (
                        <Image
                          source={selectedIcon}
                          style={styles.selectedIcon}
                        />
                      ) : null}
                      <View style={styles.doctorDetailsContainer}>
                        <Text style={styles.doctorDetailsIcon}>
                          {item.consultationId.charAt(0).toUpperCase() +
                            item.consultationId.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.doctorDetailsMain}>
                        <Text style={styles.doctorDetailsMainDesc}>
                          Reference: {item.consultationId}
                        </Text>
                        <Text style={styles.doctorDetailsMainDesc}>
                          Patient Name: {item.consultationId}
                        </Text>
                        <Text style={styles.doctorDetailsMainDesc}>
                          Date: {item.consultationId}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index}
                />
              ) : null}
            </ScrollView>
            <TouchableOpacity
              onPress={this.onClickProceedBtn.bind(this)}
              style={[
                styles.proceedBtnView,
                this.state.pointOnExisting || this.state.pointOnNew
                  ? styles.enable
                  : styles.disable
              ]}
            >
              <View>
                <Text style={styles.proceedBtnTxtHeader}>PROCEED</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        ) : null}
        <ScrollView style={styles.searchResultsContainer}>
          <FlatList
            data={this.state.allDocData}
            renderItem={({ item }) => (
              <DoctorSearchDetailComponent
                docDetail={item}
                props={this.props}
                onUpdate={this.onUpdate}
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
    this.onClickCallBtn = this.onClickCallBtn.bind(this);
  }

  onClickCallBtn(value) {
    this.props.onUpdate(value);
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
  modalView: {
    marginBottom: 55
  },
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
  doctorDetailsVideoIcon: { height: 40, width: 40 },
  existingConTxtHeader: {
    marginLeft: 10,
    fontSize: 18,
    marginBottom: 5,
    flex: 1
  },
  selectConView: {
    paddingBottom: 13,
    paddingTop: 13,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: appThemeColor.textColorTheme
  },
  selectConTxtHeader: {
    fontSize: 20,
    color: "white"
  },
  proceedBtnView: {
    paddingBottom: 13,
    paddingTop: 13,
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: DEVICE_WIDTH
  },
  proceedBtnTxtHeader: {
    fontSize: 20,
    color: "white"
  },
  arrowIcon: {
    height: 25,
    width: 25,
    marginRight: 12
  },
  sections: {
    borderWidth: 0.5,
    borderColor: "black",
    flexDirection: "row",
    paddingBottom: 13,
    paddingTop: 13,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  selectedIcon: {
    height: 18,
    width: 18,
    position: "absolute",
    bottom: 5,
    right: 5
  },
  pointIcon: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 3,
    right: 3
  },
  enable: {
    backgroundColor: appThemeColor.textColorTheme
  },
  disable: {
    backgroundColor: "gray"
  }
});
