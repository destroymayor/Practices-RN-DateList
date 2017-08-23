/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Alert, FlatList, StyleSheet, Platform, Text, View } from "react-native";

import FireBaseApp from "./utils/FirebaseAPI";
import ItemBtn from "./utils/ItemBtn";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default class Hoteldatelist extends Component {
  render() {
    const { params } = this.props.navigation.state;
    const AllDatas = params.AllData.sort((before, rear) => {
      return before.state > rear.state ? 1 : rear.state > before.state ? -1 : 0;
    });

    const platforms = Platform.OS === "android" ? "android" : "ios";
    return (
      <View style={styles.container}>
        <FlatList
          data={AllDatas}
          keyExtractor={item => item._key}
          initialNumToRender={10}
          renderItem={({ item }) => {
            const RoomStatesPlatform = item.platform == "android" ? "android" : "apple-ios";
            const RoomStatesPlatformColor = item.platform == "android" ? "#00bb00" : "#222";
            const RoomStates = item.state == "yes" ? "確定要退訂？" : "確定要添加訂房？";
            const RoomStatesDate =
              item.state == "yes" ? "選定退租日期為 " + params.SelectDate : "選定出租日期為 " + params.SelectDate;
            return (
              <View style={styles.ItemRowView}>
                <MaterialCommunityIcons
                  name={item.state == "yes" ? RoomStatesPlatform : "check"}
                  color={item.state == "yes" ? "#222" : "#00bb00"}
                  size={35}
                />
                <Text style={styles.ContentText}>
                  房名：{item._key}
                  {"\n"}
                  {item.state == "yes" ? "訂房日期：" : "上次退租："}
                  {item.date}
                  {"\n"}
                  <Text style={[styles.ContentText, { color: item.state == "yes" ? "#ec0000" : "#222" }]}>
                    狀態：{item.state == "yes" ? "已出租" : "尚未出租"}
                  </Text>
                </Text>

                <ItemBtn
                  styles={[styles.ItemBtn, { backgroundColor: item.state == "yes" ? "#ce0000" : "#00bb00" }]}
                  Text={item.state == "yes" ? "退租" : "訂房"}
                  onPress={() => {
                    Alert.alert(RoomStates, RoomStatesDate, [
                      { text: "取消", onPress: () => console.log("取消") },
                      {
                        text: "確定",
                        onPress: () => {
                          const addroom = FireBaseApp.database().ref("hoteldatelist/" + item._key);
                          if (item.state == "yes") {
                            if (item.platform == Platform.OS) {
                              addroom.update({
                                date: params.SelectDate,
                                platform: platforms,
                                state: item.state == "yes" ? "no" : "yes"
                              });

                              this.props.navigation.goBack(null);
                            } else {
                              Alert.alert("無法退訂", "您必須以 " + item.platform + " 平台來退訂", [
                                {
                                  text: "確定",
                                  onPress: () => {
                                    console.log("確定");
                                  }
                                }
                              ]);
                            }
                          } else {
                            addroom.update({
                              date: params.SelectDate,
                              platform: platforms,
                              state: item.state == "yes" ? "no" : "yes"
                            });
                            this.props.navigation.goBack(null);
                          }
                        }
                      }
                    ]);
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ContentText: {
    fontSize: 18,
    color: "#222",
    marginRight: 5,
    marginLeft: 5
  },
  ItemRowView: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#e0e0e0"
  },
  ItemBtn: {
    width: 80,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 5
  }
  // TitleIcon: {
  //   borderRadius: 10,
  //   overflow: "hidden",
  //   borderWidth: 1,
  //   borderColor: "#fff",
  //   width: 30,
  //   height: 30
  // }
});
