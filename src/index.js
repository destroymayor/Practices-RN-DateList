/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Platform, Text, View } from "react-native";

import FireBaseApp from "./utils/FirebaseAPI";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["fr"] = {
  monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
  monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
  dayNames: ["禮拜日", "禮拜一", "禮拜二", "禮拜三", "禮拜四", "禮拜五", "禮拜六"],
  dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"]
};
LocaleConfig.defaultLocale = "fr";

export default class index extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: true,
      RoomDateState: [],
      AllData: null
    };
    this.ref = null;
  }

  componentWillMount() {
    this._FetchFireBase();
  }

  _FetchFireBase() {
    this.ref = FireBaseApp.database().ref("hoteldatelist/");

    this.ref.on("value", snapshot => {
      const ItemsDate = [];
      let markedDate = {};
      snapshot.forEach(val => {
        ItemsDate.push({
          date: val.val().date,
          state: val.val().state,
          platform: val.val().platform,
          _key: val.key
        });

        if (val.val().state == "yes") {
          markedDate[val.val().date] = {
            selected: true,
            marked: true
          };
        }

        this.setState({
          AllData: ItemsDate,
          RoomDateState: markedDate,
          selected: val.val().state,
          visible: false
        });
      });
    });
  }

  _onDayPress = day => {
    this.props.navigation.navigate("Hoteldatelist", {
      SelectDate: day.dateString,
      AllData: this.state.AllData
    });
  };

  _renderCalendar = () =>
    <Calendar
      onDayPress={day => {
        this._onDayPress(day);
      }}
      onMonthChange={month => {
        console.log("month changed", month);
      }}
      firstDay={1}
      theme={{
        selectedDayBackgroundColor: "#ec0000",
        todayTextColor: "#2897ff",
        textDisabledColor: "#4f4f4f",
        monthTextColor: "#222222"
      }}
      renderArrow={direction =>
        <MaterialIcons
          size={40}
          color="#2897ff"
          name={direction == "left" ? "keyboard-arrow-left" : "keyboard-arrow-right"}
        />}
      markedDates={this.state.RoomDateState}
      styleSheet={calendarStyles}
    />;

  render() {
    return (
      <ScrollView scrollEnabled={false} style={styles.container}>
        {this.state.visible
          ? <View style={styles.LoadingView}>
              <ActivityIndicator size="large" color="#2894ff" animating={this.state.visible} />
              <Text style={styles.LoadingText}>載入資料中</Text>
            </View>
          : this._renderCalendar()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  LoadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  LoadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#2894ff"
  }
});

const calendarStyles = StyleSheet.create({
  header: {
    paddingVertical: 20
  },
  week: {
    marginTop: 0,
    paddingBottom: 10
  },
  monthText: {
    fontSize: 30,
    lineHeight: 30,
    margin: 0,
    letterSpacing: 1.45
  },
  dayHeader: {
    color: "#222",
    fontSize: 16,
    paddingVertical: 20
  },
  day: {
    justifyContent: "center",
    paddingVertical: 25,
    marginHorizontal: 10
  },
  dayText: {
    fontSize: 22
  },
  todayText: {
    fontSize: 22
  },
  disabledText: {
    opacity: 0.5,
    fontSize: 22
  }
});
