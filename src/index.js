/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Platform, Text, View } from "react-native";

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

  componentDidMount() {
    this.ref = FireBaseApp.database().ref("hoteldatelist/");
    this.ref.on("value", this._FetchFireBase);
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off("value", this._FetchFireBase);
    }
  }

  _FetchFireBase = snapshot => {
    const ItemsDate = [];
    const markedDate = {};
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
    });

    this.setState({
      AllData: ItemsDate,
      RoomDateState: markedDate,
      visible: false
    });
  };

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
          color="#222222"
          name={direction == "left" ? "keyboard-arrow-left" : "keyboard-arrow-right"}
        />}
      markedDates={this.state.RoomDateState}
      styleSheet={calendarStyles}
    />;

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {this.state.visible
          ? <ActivityIndicator
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              size="large"
              color="#2894ff"
              animating={this.state.visible}
            />
          : <ScrollView scrollEnabled={false} style={{ flex: 1 }}>
              {this._renderCalendar()}
            </ScrollView>}
      </View>
    );
  }
}

const calendarStyles = StyleSheet.create({
  header: {
    paddingVertical: 15
  },
  week: {
    marginTop: 0,
    marginBottom: 10
  },
  monthText: {
    fontSize: 25,
    lineHeight: 30,
    margin: 0,
    letterSpacing: 1.45
  },
  dayHeader: {
    color: "#222222",
    fontSize: 16,
    paddingVertical: 20
  },
  day: {
    justifyContent: "center",
    paddingVertical: 25,
    marginHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 15
  },
  dayText: {
    fontSize: 22,
    paddingTop: 10
  },
  todayText: {
    fontSize: 22
  },
  disabledText: {
    opacity: 0.5,
    fontSize: 22
  }
});
