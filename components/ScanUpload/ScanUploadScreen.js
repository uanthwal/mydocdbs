import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Picker,
  Dimensions,
  Modal,
  WebView
} from "react-native";
import closeModalIcon from "../../images/close.png";
import imgPreviewIcon from "../../images/view-img.png";
import imgDeleteIcon from "../../images/remove.png";
import cameraAttachmentIcon from "../../images/camera-attachment.png";
import docAttachmentIcon from "../../images/doc-attachment.png";
import { appThemeColor } from "../../AppGlobalConfig";
var ImagePicker = require("react-native-image-picker");
import FilePickerManager from "react-native-file-picker";
import PDFView from "react-native-pdf-view";
const storageServices = require("../Shared/Storage.js");
import { getUserConsultations } from "../../AppGlobalAPIs";
import { uploadAttachments } from "../../AppGlobalAPIs";

export default class ScanUploadScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      consultationData: [],
      consultation: "-1",
      attachments: [],
      displayAttachments: false,
      modalVisible: false,
      previewData: { data: null, type: null }
    };
    this.onClickAddAttachment = this.onClickAddAttachment.bind(this);
    this.consultationChanged = this.consultationChanged.bind(this);
    this.onClickCloseModal = this.onClickCloseModal.bind(this);
    this.onClickAddFile = this.onClickAddFile.bind(this);
    this.onClickUploadBtn = this.onClickUploadBtn.bind(this);
  }

  componentDidMount() {
    let loggedInUserIdPromise = storageServices.readMultiple([
      "loggedInUserId",
      "auth-api-key",
      "x-csrf-token"
    ]);
    loggedInUserIdPromise
      .then(value => {
        let headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-api-key": JSON.parse(value[1]),
          "x-csrf-token": JSON.parse(value[2])
        };
        getUserConsultations(headers, JSON.parse(value[0]))
          .then(responseData => {
            console.log("getUserConsultations API Response: ", responseData);
            this.setState({ consultationData: responseData.data });
          })
          .catch(error => {
            console.log("getUserConsultations Response Error: ", error);
          });
      })
      .catch(error => {
        console.log("loggedInUserIdPromise Response Error: ", error);
      });
  }

  consultationChanged(value) {
    console.log(value);
    if (value != -1) {
      // let selectedIndex = value - 1;
      this.setState({
        consultation: value
        // consultation: this.state.consultationData[selectedIndex]["consultationId"]
      });
    } else {
      this.setState({ consultation: -1 });
    }
    this.setState({ attachments: JSON.parse(JSON.stringify([])) });
    setTimeout(_ => {
      this.setState({
        displayAttachments: this.state.attachments.length == 0 ? false : true
      });
    }, 100);
  }

  onClickViewAttachment(value) {
    console.log(value);
    let index = this.state.attachments.findIndex(i => i.id == value);
    console.log(this.state.attachments[index]["data"]);
    this.setState({
      previewData: {
        type: this.state.attachments[index]["type"],
        data: this.state.attachments[index]["data"]
      }
    });
    this.setState({
      modalVisible: true
    });
  }

  onClickCloseModal() {
    this.setState({ previewData: { data: null, type: null } });
    this.setState({
      modalVisible: false
    });
  }

  onClickRemoveAttachment(value) {
    let temp = JSON.parse(JSON.stringify(this.state.attachments));
    let index = temp.findIndex(i => i.id == value);
    index != -1 ? temp.splice(index, 1) : null;
    this.setState({ attachments: JSON.parse(JSON.stringify(temp)) });
    setTimeout(_ => {
      this.setState({
        displayAttachments: this.state.attachments.length == 0 ? false : true
      });
    }, 100);
  }

  onClickAddAttachment() {
    var options = {
      storageOptions: {
        skipBackup: false,
        path: "images"
      }
    };
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        this.state.attachments.push({
          id: this.state.consultation + "_" + new Date().getTime(),
          name: this.state.consultation + "_" + new Date().getTime(),
          data: response.uri,
          type: "image"
        });
        this.setState({ displayAttachments: true });
      }
    });
  }

  onClickAddFile() {
    FilePickerManager.showFilePicker(null, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled file picker");
      } else if (response.error) {
        console.log("FilePickerManager Error: ", response.error);
      } else {
        this.state.attachments.push({
          id: this.state.consultation + "_" + new Date().getTime(),
          name: this.state.consultation + "_" + new Date().getTime(),
          data: response.path,
          type: response.type
        });
        this.setState({ displayAttachments: true });
      }
    });
  }

  onClickUploadBtn() {
    let loggedInUserIdPromise = storageServices.readMultiple([
      "loggedInUserId",
      "auth-api-key",
      "x-csrf-token"
    ]);
    loggedInUserIdPromise
      .then(value => {
        let headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-api-key": JSON.parse(value[1]),
          "x-csrf-token": JSON.parse(value[2])
        };
        let payload = { consultationId: this.state.consultation };
        uploadAttachments(headers, payload)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log("onClickUploadBtn Response Error: ", error);
          });
      })
      .catch(error => {
        console.log("loggedInUserIdPromise Response Error: ", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.onClickCloseModal();
          }}
        >
          {this.state.previewData.type == "image" ? (
            <View style={styles.containerView}>
              <View style={styles.imagePreviewModal}>
                <Image
                  style={styles.attachmentImg}
                  source={{
                    uri: this.state.previewData.data
                  }}
                />
                <View style={styles.closeBtnView}>
                  <TouchableOpacity onPress={this.onClickCloseModal.bind(this)}>
                    <Image
                      source={closeModalIcon}
                      style={styles.closeModalBtn}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <PDFView
              ref={pdf => {
                this.pdfView = pdf;
              }}
              src={this.state.previewData.data}
              onLoadComplete={pageCount => {
                this.pdfView.setNativeProps({
                  zoom: 1.5
                });
              }}
              style={{ flex: 1 }}
            />
          )}
        </Modal>

        <Picker
          style={[styles.input, styles.consultationsPicker]}
          selectedValue={this.state.consultation}
          onValueChange={this.consultationChanged.bind(this)}
        >
          <Picker.Item label="Select consultation" value="-1" />
          {this.state.consultationData.map((prop, key) => {
            return (
              <Picker.Item
                label={prop.consultationId}
                value={prop.consultationId}
                key={key}
              />
            );
          })}
        </Picker>
        <View style={styles.attachmentsBlock}>
          <View style={styles.attachmentsViewHdrLbl}>
            <Text style={{ fontSize: 18 }}>Attachments: </Text>
            <TouchableOpacity onPress={this.onClickAddAttachment.bind(this)}>
              <Image
                source={cameraAttachmentIcon}
                style={styles.addAttachmentsIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onClickAddFile.bind(this)}>
              <Image
                source={docAttachmentIcon}
                style={styles.addAttachmentsIcon}
              />
            </TouchableOpacity>
          </View>
          {this.state.displayAttachments ? (
            <View>
              {this.state.attachments.map((prop, key) => {
                return (
                  <View key={key} style={styles.attachmentView}>
                    <Text style={styles.attachmentNameLbl}>{prop.id}</Text>
                    <TouchableOpacity
                      onPress={this.onClickViewAttachment.bind(this, prop.id)}
                    >
                      <Image
                        source={imgPreviewIcon}
                        style={styles.addAttachmentsIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.onClickRemoveAttachment.bind(this, prop.id)}
                    >
                      <Image
                        source={imgDeleteIcon}
                        style={styles.addAttachmentsIcon}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text>No attachments!!</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={this.onClickUploadBtn.bind(this)}
          style={[styles.proceedBtnView, styles.enable]}
        >
          <View>
            <Text style={styles.proceedBtnTxtHeader}>UPLOAD</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const MARGIN = 40;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  addAttachmentsIcon: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
    marginVertical: 10
  },
  attachmentNameLbl: {
    flex: 1
  },
  consultationsPicker: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 4,
    backgroundColor: appThemeColor.ipBgColor,
    width: DEVICE_WIDTH - 40
  },
  attachmentsBlock: {
    marginTop: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  attachmentsViewHdrLbl: {
    flexDirection: "row",
    alignItems: "center"
  },
  attachmentView: {
    flexDirection: "row",
    alignItems: "center"
  },
  containerView: {},
  imagePreviewModal: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT
  },
  closeBtnView: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    width: DEVICE_WIDTH
  },
  attachmentImg: {
    height: DEVICE_HEIGHT - 110,
    width: DEVICE_WIDTH
  },
  closeModalBtn: {
    height: 35,
    width: 35
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
  enable: {
    backgroundColor: appThemeColor.textColorTheme
  },
  disable: {
    backgroundColor: "gray"
  }
});
