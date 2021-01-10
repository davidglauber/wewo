/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import node modules and types
import React from 'react';
import {StyleSheet, ViewStyle, View} from 'react-native';

// import colors
import Colors from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  colors: Array<string>,
  start: {x: number, y: number}, // number in range [0, 1]
  end: {x: number, y: number}, // number in range [0, 1]
  children: any,
  containerStyle: ViewStyle,
};

const GradientContainer = ({
  colors,
  start,
  end,
  containerStyle,
  children,
}: Props) => (
  <View></View>
);

export default GradientContainer;
