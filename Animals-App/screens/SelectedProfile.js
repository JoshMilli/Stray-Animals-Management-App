import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SelectedProfileUser } from './MainScreen'

const SelectedProfile = () => {
  return (
    <View>
      <Text>{SelectedProfileUser}</Text>
    </View>
  )
}

export default SelectedProfile

const styles = StyleSheet.create({})