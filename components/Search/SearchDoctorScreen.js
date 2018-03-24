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
    Image
} from "react-native";
import { URL_CONFIG } from "../../AppUrlConfig";
import { appThemeColor } from "../../AppGlobalConfig";
import videoCallIcon from "../../Images/make-call.png"

export default class DoctorSearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchtext: "",
            allDocData: [],
            isLoading: false
        };
        this.doDocFilter = this.doDocFilter.bind(this);
        this.onClickSearchBtn = this.onClickSearchBtn.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    }

    handleBackButton() {
        this.props.navigation.navigate("drawerStack");
        return true;
    }

    onClickSearchBtn() {
        Keyboard.dismiss();
        if (this.state.searchtext == "" || this.state.searchtext.trim() == "") {
            Alert.alert(
                "Search text",
                "Please enter search text!!", [{
                    text: "OK",
                    onPress: () => {
                        console.log("OK pressed");
                    },
                    style: "cancel"
                }], { cancelable: false }
            );
            return;
        }

        this.setState({ isLoading: true });
        this.setState({
            allDocData: []
        });
        fetch(
                URL_CONFIG.SEARCH_DOCTOR +
                '?q=firstname_str:"' +
                this.state.searchtext +
                '" OR lastname_str:"' +
                this.state.searchtext +
                '"&wt=json', {
                    method: "GET",
                    dataType: "jsonp",
                    jsonp: "json.wrf",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(response => response.json())
            .then(responseJson => {
                console.log("Search criteria Reponse: ", responseJson);
                this.setState({ isLoading: false });

                let data = responseJson.response.docs.map(record => {
                    return {
                        firstname: Array.isArray(record.firstname) ?
                            record.firstname[0] : record.firstname,
                        lastname: Array.isArray(record.lastname) ?
                            record.lastname[0] : record.lastname,
                        location: Array.isArray(record.location) ?
                            record.location[0] : record.location
                    };
                });
                console.log("Search criteria Reponse after modification: ", data);
                this.setState({
                    allDocData: data
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    doDocFilter() {}

    render() {
        return ( 
                <View>
                  <View style = { styles.searchContainer }>
                    <TextInput style = { styles.searchTextInput }
                      onChangeText = { searchtext => this.setState({ searchtext }) }
                      placeholder = "Type here to search Doctor by name!"
                      returnKeyLabel = { "next" }
                      underlineColorAndroid = "rgba(0,0,0,0)" />
                    <Button style = { styles.searchButton }
                      onPress = { this.onClickSearchBtn }
                      title = "Search"
                      color = { appThemeColor.btnBgColor }
                      accessibilityLabel = "Search" />
                  </View> 
                  {
                    this.state.isLoading ? ( <
                      ActivityIndicator size = "large"
                      color = "#0000ff" / >
                      ) : null
                  } 
                  <ScrollView style = { styles.searchResultsContainer }>
                    <FlatList data = { this.state.allDocData }
                      renderItem = {({ item }) => 
                                        (<DoctorSearchDetailComponent docDetail = { item }/>)
                                    }
                      keyExtractor = {(item, index) => index}
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
            isLoading: true
        };
    }

    render() {
        return ( 
          <View style = { styles.doctorDetailsOuterContainer }>
            <View style = { styles.doctorDetailsContainer }>
              <Text style = { styles.doctorDetailsIcon }> 
                {
                  this.props.docDetail.firstname.charAt(0).toUpperCase() +
                  this.props.docDetail.lastname.charAt(0).toUpperCase()
                } 
              </Text> 
            </View> 
            <View style = { styles.doctorDetailsMain }>
              <Text style = { styles.doctorDetailsMainDesc }>
                First Name: { " " } 
                            {
                              this.props.docDetail.firstname.charAt(0).toUpperCase() +
                              this.props.docDetail.firstname.slice(1)
                            } 
              </Text> 
              <Text style = { styles.doctorDetailsMainDesc } >
                Last Name: { " " } 
                           {
                            this.props.docDetail.lastname.charAt(0).toUpperCase() +
                            this.props.docDetail.lastname.slice(1)
                           } 
              </Text> 
              <Text style = { styles.doctorDetailsMainDesc }>
                    Location: {
                                this.props.docDetail.location.charAt(0).toUpperCase() +
                                this.props.docDetail.location.slice(1)
                              } 
              </Text>  
            </View> 
            <View style = { styles.doctorDetailsVideoContainer }>
              <Image source = { videoCallIcon }
                style = { styles.doctorDetailsVideoIcon }
              /> 
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