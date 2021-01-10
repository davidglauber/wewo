/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  I18nManager,
  ImageBackground,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Color from 'color';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

// import utils
import getImgSource from '../../utils/getImgSource.js';

// import components
import TouchableItem from '../../components/TouchableItem';
import {Heading6} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';

// SearchA Config
const isRTL = I18nManager.isRTL;
const SEARCH_ICON = 'magnify';
const imgHolder = require('../../assets/img/imgholder.png');

// SearchA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: '700',
    textAlign: 'left',
  },
  inputContainer: {
    marginHorizontal: 16,
    paddingBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.16)',
    paddingLeft: 8,
    paddingRight: 51,
    height: 46,
    fontSize: 16,
    textAlignVertical: 'center',
    textAlign: isRTL ? 'right' : 'left',
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 4,
    backgroundColor: Colors.primaryColor,
    overflow: 'hidden',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
  },
  categoriesList: {
    paddingBottom: 10,
  },
  cardImg: {borderRadius: 4},
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    height: 100,
    resizeMode: 'cover',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardTitle: {
    padding: 16,
    fontWeight: '700',
    fontSize: 18,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.88)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

// SearchA
export default class SearchA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [
        {
          key: 1,
          imageUri: require('../../assets/img/pizza_3.jpg'),
          name: 'Pizza',
        },
        {
          key: 2,
          imageUri: require('../../assets/img/meat_1.jpg'),
          name: 'Grill',
        },
        {
          key: 3,
          imageUri: require('../../assets/img/spaghetti_2.jpg'),
          name: 'Pasta',
        },
        {
          key: 4,
          imageUri: require('../../assets/img/soup_1.jpg'),
          name: 'Soups',
        },
        {
          key: 5,
          imageUri: require('../../assets/img/salad_1.jpg'),
          name: 'Salads',
        },
        {
          key: 6,
          imageUri: require('../../assets/img/cake_2.jpg'),
          name: 'Dessert',
        },
      ],
    };
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;

    Keyboard.dismiss();

    navigation.navigate(screen);
  };

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({item, index}) => (
    <ImageBackground
      key={index}
      defaultSource={imgHolder}
      source={getImgSource(item.imageUri)}
      imageStyle={styles.cardImg}
      style={styles.card}>
      <View>
        <TouchableItem
          onPress={this.navigateTo('Category')}
          style={styles.cardContainer}
          // borderless
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  render() {
    const {categories} = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.titleContainer}>
          <Heading6 style={styles.titleText}>Search</Heading6>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Food name or description..."
            returnKeyType="search"
            maxLength={50}
            style={styles.textInput}
          />
          <View style={styles.searchButtonContainer}>
            <TouchableItem
              onPress={this.navigateTo('SearchResults')}
              // borderless
            >
              <View style={styles.searchButton}>
                <Icon
                  name={SEARCH_ICON}
                  size={23}
                  color={Colors.onPrimaryColor}
                />
              </View>
            </TouchableItem>
          </View>
        </View>

        <View style={styles.container}>
          <FlatList
            data={categories}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCategoryItem}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      </SafeAreaView>
    );
  }
}
