/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default class ItemBtn extends Component {
  render() {
    return (
      <TouchableOpacity style={this.props.styles} onPress={this.props.onPress}>
        <Text style={styles.BtnText}>
          {this.props.Text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  AddBtn: {
    width: 80,
    height: 40,
    backgroundColor: "#00db00",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginRight: 5
  },
  BtnText: {
    fontSize: 18,
    color: "#ffffff"
  }
});
