import React, { Component } from 'react'
import { Image, StyleSheet } from 'react-native'

const ImagesExample = () => (
   <Image source = {require('../assets/logo.png')} style = {styles.container} / >
)

const styles = StyleSheet.create({
    container: {
      width: 300,
      height: 300,
      top: -40,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center'
      }
      

})
export default ImagesExample