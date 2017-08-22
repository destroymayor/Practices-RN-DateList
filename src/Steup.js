import React, { Component } from "react";

import Index from "./index";
import Hoteldatelist from "./Hoteldatelist";

import { StackNavigator, NavigationActions, getStateForAction } from "react-navigation";

const Steup = StackNavigator(
  {
    Index: { screen: Index, navigationOptions: { headerTitle: "訂房日曆" } },
    Hoteldatelist: { screen: Hoteldatelist, navigationOptions: { headerTitle: "訂房資訊" } }
  },
  { geeturesEnabled: false }
);

const navigateOnce = getStateForAction => (action, state) => {
  const { type, routeName } = action;
  return state &&
  type === NavigationActions.NAVIGATE &&
  routeName === state.routes[state.routes.length - 1].routeName
    ? null
    : getStateForAction(action, state);
};
Steup.router.getStateForAction = navigateOnce(Steup.router.getStateForAction);

export default class App extends Component {
  render() {
    return <Steup onNavigationStateChange={null} />;
  }
}
