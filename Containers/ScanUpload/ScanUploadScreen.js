import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

export default class ScanUploadScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Scan upload screen ooooooooo</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
