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
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

// import components
import Divider from '../../components/divider/Divider';
import {Heading6} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';
import SimpleProductCard from '../../components/cards/SimpleProductCard';

// import colors
import Colors from '../../theme/colors';

// SearchB Config
const isRTL = I18nManager.isRTL;
const FILTER_ICON = 'filter-variant';

// SearchB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingBottom: 8,
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
  filtersList: {
    paddingVertical: 8,
    paddingRight: isRTL ? 0 : 16,
    paddingLeft: isRTL ? 16 : 0,
  },
  filterItemContainer: {
    marginRight: isRTL ? 16 : 0,
    marginLeft: isRTL ? 0 : 16,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(35, 47, 52, 0.08)',
    overflow: 'hidden',
  },
  filterItem: {flex: 1, justifyContent: 'center'},
  filterName: {
    top: -1,
    fontWeight: '700',
    color: 'rgb(35, 47, 52)',
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
  },
});

// SearchB
export default class SearchB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: [
        {name: 'Special offers', picked: true},
        {name: 'Dessert', picked: false},
        {name: 'Grill', picked: false},
        {name: 'Pasta', picked: false},
        {name: 'Pizza', picked: false},
        {name: 'Salad', picked: false},
        {name: 'Soup', picked: false},
      ],
      offers: [
        {
          imageUri: require('../../assets/img/sandwich_2.jpg'),
          name: 'Subway Sandwich',
          price: 8.49,
          description:
            'Ham sandwich with two servings of crisp veggies on freshly baked bread for under 400 calories',
        },
        {
          imageUri: require('../../assets/img/pizza_1.jpg'),
          name: 'Pizza Margarita 35cm',
          price: 10.99,
          description:
            'Made with San Marzano tomatoes, mozzarella cheese, fresh basil, salt and extra-virgin olive oil',
        },
        {
          imageUri: require('../../assets/img/cake_1.jpg'),
          name: 'Chocolate Cake',
          price: 4.99,
          description: 'Cake flavored with melted chocolate, cocoa powder',
        },
      ],
      dessert: [
        {
          imageUri: require('../../assets/img/cake_1.jpg'),
          name: 'Chocolate Cake',
          price: 4.99,
          description: 'Cake flavored with melted chocolate, cocoa powder',
        },
        {
          imageUri: require('../../assets/img/cake_2.jpg'),
          name: 'Strawberry Cake',
          price: 6.99,
          description:
            'Cream cheese, cake flour, heavy cream, powdered sugar, eggs',
        },
      ],
      grill: [
        {
          imageUri: require('../../assets/img/barbecue_1.jpg'),
          name: 'Beef Steak',
          price: 14.99,
          description:
            'Boneless rib-eye steaks (about 12 ounces each) or filets mignons (8 to 10 ounces each), trimmed',
        },
        {
          imageUri: require('../../assets/img/meat_1.jpg'),
          name: 'Grilled Beef Steaks',
          price: 24.99,
          description:
            'Beef steaks, about 3/4 inch thick (porterhouse, rib eye, sirloin or T-bone steaks) or about 1 inch thick (tenderloin steaks)',
        },
      ],
      pasta: [
        {
          imageUri: require('../../assets/img/spaghetti_1.jpg'),
          name: 'Spaghetti and Meatballs',
          price: 14.99,
          description:
            'Ground beef, tomato sauce, tomato paste, green bell pepper, diced tomatoes',
        },
        {
          imageUri: require('../../assets/img/spaghetti_2.jpg'),
          name: 'Filipino Spaghetti',
          price: 24.99,
          description:
            'Hot dogs, evaporated milk, ground pork, tomato sauce, red peppers',
        },
      ],
      pizza: [
        {
          imageUri: require('../../assets/img/pizza_1.jpg'),
          name: 'Pizza Margarita 35cm',
          price: 10.99,
          description:
            'Made with San Marzano tomatoes, mozzarella cheese, fresh basil, salt and extra-virgin olive oil',
        },
        {
          imageUri: require('../../assets/img/pizza_2.jpg'),
          name: 'Pizza Formaggio',
          price: 10.9,
          description:
            'Tomato sauce, peeled tomato, mozzarella, oregano, hard goat cheese, bacon, red onion, olives',
        },
      ],
      salad: [
        {
          imageUri: require('../../assets/img/salad_1.jpg'),
          name: 'Fig Salad with Goat Cheese',
          price: 8.99,
          description:
            'Goat cheese, white balsamic vinegar, fresh figs, honey, walnut oil',
        },
      ],
      soup: [
        {
          imageUri: require('../../assets/img/soup_1.jpg'),
          name: 'Roasted Carrot Soup',
          price: 11.99,
          description:
            'Plain greek yogurt, olive oil, garlic, fresh basil, whole peeled tomatoes',
        },
      ],
    };
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;

    Keyboard.dismiss();

    navigation.navigate(screen);
  };

  handleFilterPress = (item) => () => {
    const {filters} = this.state;
    const index = filters.indexOf(item);
    const filtersActiveIndex = filters.findIndex((e) => e.picked === true);
    let scrollByIndex;

    if (filtersActiveIndex !== index) {
      filters[filtersActiveIndex].picked = false;
      filters[index].picked = true;

      this.setState(
        {
          filters: [...filters],
        },
        () => {
          this.filtersList.scrollToIndex({animated: true, index: index});

          if (isRTL) {
            scrollByIndex = -(index - filtersActiveIndex);
          } else {
            scrollByIndex = index - filtersActiveIndex;
          }

          this.productSwiper.scrollBy(scrollByIndex, true);
        },
      );
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderFilterItem = ({item, index}) => (
    <View style={styles.filterItemContainer}>
      <TouchableItem
        onPress={this.handleFilterPress(item)}
        style={[
          styles.filterItem,
          item.picked && {backgroundColor: Colors.primaryColor},
        ]}>
        <Text
          style={[
            styles.filterName,
            item.picked && {color: Colors.onPrimaryColor},
          ]}>
          {item.name}
        </Text>
      </TouchableItem>
    </View>
  );

  renderProductItem = ({item, index}) => (
    <SimpleProductCard
      key={index}
      onPress={this.navigateTo('Product')}
      activeOpacity={0.7}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      description={item.description}
    />
  );

  renderSeparator = () => <Divider />;

  onIndexChanged = (index) => {
    const {filters} = this.state;
    const filtersLength = filters.length - 1;
    const filtersActiveIndex = filters.findIndex((e) => e.picked === true);

    if (filtersActiveIndex !== index) {
      filters[filtersActiveIndex].picked = false;

      if (isRTL) {
        filters[filtersLength - index].picked = true;
      } else {
        filters[index].picked = true;
      }

      this.setState(
        {
          filters: [...filters],
        },
        () => {
          if (isRTL) {
            this.filtersList.scrollToIndex({
              animated: true,
              index: filtersLength - index,
            });
          } else {
            this.filtersList.scrollToIndex({animated: true, index: index});
          }
        },
      );
    }
  };

  render() {
    const {
      filters,
      offers,
      dessert,
      grill,
      pasta,
      pizza,
      salad,
      soup,
    } = this.state;

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
            placeholder="Food name or description"
            returnKeyType="search"
            maxLength={50}
            style={styles.textInput}
          />
          <View style={styles.searchButtonContainer}>
            <TouchableItem onPress={this.navigateTo('SearchFilter')}>
              <View style={styles.searchButton}>
                <Icon
                  name={FILTER_ICON}
                  size={23}
                  color={Colors.onPrimaryColor}
                />
              </View>
            </TouchableItem>
          </View>
        </View>

        <View>
          <FlatList
            ref={(r) => (this.filtersList = r)}
            data={filters}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderFilterItem}
            horizontal
            alwaysBounceHorizontal={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        <Swiper
          ref={(r) => (this.productSwiper = r)}
          index={isRTL ? filters.length - 1 : 0}
          onIndexChanged={this.onIndexChanged}
          loop={false}
          showsPagination={false}>
          {/* OFFERS SLIDE */}
          <FlatList
            data={offers}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
          />

          {/* DESSERT SLIDE */}
          <FlatList
            data={dessert}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
          />

          {/* GRILL SLIDE */}
          <FlatList
            data={grill}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
          />

          {/* PASTA SLIDE */}
          <FlatList
            data={pasta}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
          />

          {/* PIZZA SLIDE */}
          <FlatList
            data={pizza}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
          />

          {/* SLALD SLIDE */}
          <FlatList
            data={salad}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
          />

          {/* SOUP SLIDE */}
          <FlatList
            data={soup}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </Swiper>
      </SafeAreaView>
    );
  }
}
