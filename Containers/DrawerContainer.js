import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { NavigationActions } from 'react-navigation'

import appThemeColor from '../AppGlobalConfig'
import aboutusIcon from '../Images/about-us.png'
import connectIcon from '../Images/icon/connect.png'
import rateusIcon from '../Images/rate-us.png'
import logoutIcon from '../Images/logout.png'
import homeIcon from '../Images/home.png'
import profileIcon from '../Images/profile.png'

export default class DrawerContainer extends React.Component {


  logout = () => {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'loginStack' })]
    })
    this.props.navigation.dispatch(actionToDispatch)
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
      <TouchableOpacity style={styles.drawerItem}
      onPress={() => navigation.navigate('homescreen')}
        activeOpacity={1} >
        <Image source={homeIcon} style={styles.drawerItemIcon} />
        <Text style={styles.drawerItemText}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem}
      onPress={() => navigation.navigate('profilescreen')}
        activeOpacity={1} >
        <Image source={profileIcon} style={styles.drawerItemIcon} />
        <Text style={styles.drawerItemText}>My Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem}
      onPress={() => navigation.navigate('ratingscreen')}
        activeOpacity={1} >
        <Image source={rateusIcon} style={styles.drawerItemIcon} />
        <Text style={styles.drawerItemText}
          >
          Rate us
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem}
      onPress={() => navigation.navigate('aboutscreen')}
        activeOpacity={1} >
        <Image source={aboutusIcon} style={styles.drawerItemIcon} />
        <Text style={styles.drawerItemText}
          >
          About us
        </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerItem}
      onPress={() => navigation.navigate('doctorconnectscreen')}
        activeOpacity={1} >
        <Image source={connectIcon} style={styles.drawerItemIcon} />
        <Text style={styles.drawerItemText}
          >
          Connect
        </Text>
    </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem}
      onPress={this.logout}
        activeOpacity={1} >
        <Image source={logoutIcon} style={styles.drawerItemIcon} />
        <Text style={styles.drawerItemText}
          >
          Logout
        </Text>
      </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  drawerItem: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
  },
  drawerItemIcon: {
    height: 40,
    width: 40
  },
  drawerItemText: {
    marginLeft: 8,
    fontSize: 20
  }
})
