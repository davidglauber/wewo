/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component, Fragment} from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from 'color';

// import utils
import getImgSource from '../../utils/getImgSource.js';

// import components
import Button from '../../components/buttons/Button';
import {Caption, Heading5, SmallText} from '../../components/text/CustomText';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import Icon from '../../components/icon/Icon';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';

// ProductB Config
const IOS = Platform.OS === 'ios';
const MINUS_ICON = IOS ? 'ios-remove' : 'md-remove';
const PLUS_ICON = IOS ? 'ios-add' : 'md-add';
const FAVORITE_ICON = IOS ? 'ios-heart' : 'md-heart';
const CLOSE_ICON = IOS ? 'ios-close' : 'md-close';
const imgHolder = require('../../assets/img/imgholder.png');

// ProductB Styles
const styles = StyleSheet.create({
  topArea: {flex: 0, backgroundColor: Colors.primaryColor},
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    width: '100%',
    height: 236,
  },
  productImg: {
    width: '100%',
    height: 236,
    resizeMode: 'cover',
  },
  bottomOverlay: {flex: 1},
  topButton: {
    position: 'absolute',
    top: 16,
    borderRadius: 18,
    backgroundColor: Colors.background,
  },
  left: {left: 16},
  right: {right: 16},
  buttonIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  favorite: {
    backgroundColor: Colors.secondaryColor,
  },
  productDescription: {
    marginTop: -22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
  },
  productTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 10,
  },
  productTitle: {
    fontWeight: '700',
  },
  priceText: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.black,
  },
  shortDescription: {
    paddingVertical: 8,
    textAlign: 'left',
  },
  caption: {
    padding: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  dishContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    height: 56,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emptyIndicator: {
    marginRight: 24,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Color(Colors.black).alpha(0.4),
    backgroundColor: Colors.background,
  },
  filledIndicator: {
    marginRight: 24,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Color(Colors.black).alpha(0.4),
  },
  dishName: {
    top: -1,
    lineHeight: 22,
  },
  dishPrice: {
    color: Colors.secondaryText,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quantity: {
    top: -1,
    paddingHorizontal: 18,
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color(Colors.primaryColor).alpha(0.88),
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    width: '100%',
    padding: 16,
    backgroundColor: '#efefef',
  },
  bottomArea: {flex: 0, backgroundColor: '#efefef'},
});

// ProductB
export default class ProductB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        imageUri: require('../../assets/img/pizza_1.jpg'),
        name: 'Pizza Formaggio',
        description:
          'Tomato sauce, peeled tomato, mozzarella, oregano, hard goat cheese, bacon, red onion, olives',
        price: 10.9,
        singleProductPrice: 10.9,
        quantity: 1,
        sideDish: 20,
        total: 10.9,
      },
      extras: [
        {name: 'Egg', picked: false, price: 0.5},
        {name: 'Cherry tomato', picked: false, price: 0.9},
        {name: 'Ham', picked: false, price: 1.5},
        {name: 'Pepperoni', picked: false, price: 1.5},
        {name: 'Artichoke', picked: false, price: 1.7},
      ],
      favorite: false,
    };
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onPressAddToFavorites = () => {
    const {favorite} = this.state;

    this.setState({
      favorite: !favorite,
    });
  };

  setExtraDish = (item) => () => {
    const {product, extras} = this.state;
    const index = extras.indexOf(item);
    const picked = extras[index].picked;

    if (picked) {
      product.singleProductPrice -= item.price;
      product.total -= product.quantity * item.price;
    } else {
      product.singleProductPrice += item.price;
      product.total += product.quantity * item.price;
    }

    extras[index].picked = !picked;

    this.setState({
      product,
      extras: [...extras],
    });
  };

  onPressIncreaseAmount = () => {
    const {product} = this.state;
    let {quantity} = product;

    quantity += 1;
    product.quantity = quantity;

    const total = quantity * product.singleProductPrice;
    product.total = total;

    this.setState({
      product,
    });
  };

  onPressDecreaseAmount = () => {
    const {product} = this.state;
    let {quantity} = product;

    quantity -= 1;
    quantity = quantity < 1 ? 1 : quantity;
    product.quantity = quantity;

    const total = quantity * product.singleProductPrice;
    product.total = total;

    this.setState({
      product,
    });
  };

  render() {
    const {product, favorite, extras} = this.state;
    const {price, description, quantity, total} = product;

    return (
      <Fragment>
        <StatusBar
          backgroundColor={Colors.primaryColor}
          barStyle="light-content"
        />
        <SafeAreaView style={styles.topArea} />
        <View style={styles.screenContainer}>
          <ScrollView>
            <View style={styles.header}>
              <ImageBackground
                defaultSource={imgHolder}
                source={getImgSource(product.imageUri)}
                style={styles.productImg}>
                <GradientContainer
                  colors={[Colors.black, 'transparent']}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0.6}}
                  containerStyle={styles.bottomOverlay}
                />
              </ImageBackground>

              <View style={[styles.topButton, styles.left]}>
                <TouchableItem onPress={this.goBack} borderless>
                  <View style={styles.buttonIconContainer}>
                    <Icon
                      name={CLOSE_ICON}
                      size={IOS ? 24 : 22}
                      color={Colors.secondaryText}
                    />
                  </View>
                </TouchableItem>
              </View>

              <View
                style={[
                  styles.topButton,
                  styles.right,
                  favorite && styles.favorite,
                ]}>
                <TouchableItem onPress={this.onPressAddToFavorites} borderless>
                  <View style={styles.buttonIconContainer}>
                    <Icon
                      name={FAVORITE_ICON}
                      size={IOS ? 18 : 20}
                      color={
                        favorite
                          ? Colors.onSecondaryColor
                          : Colors.secondaryText
                      }
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>

            <View style={styles.productDescription}>
              <View style={styles.productTitleContainer}>
                <Heading5 style={styles.productTitle}>{product.name}</Heading5>
                <Text style={styles.priceText}>{`$ ${price.toFixed(2)}`}</Text>
              </View>

              <SmallText style={styles.shortDescription}>
                {description}
              </SmallText>
            </View>

            <View>
              <Caption style={styles.caption}>CHOOSE PIZZA EXTRAS</Caption>
              {extras.map((item, index) => (
                <TouchableItem
                  key={index.toString()}
                  onPress={this.setExtraDish(item)}
                  useForeground>
                  <View style={styles.dishContainer}>
                    <View style={styles.indicator}>
                      <View>
                        {item.picked ? (
                          <View style={styles.filledIndicator} />
                        ) : (
                          <View style={styles.emptyIndicator} />
                        )}
                      </View>

                      <Text style={styles.dishName}>{item.name}</Text>
                    </View>

                    <Text style={styles.dishPrice}>
                      + {item.price.toFixed(2)}
                    </Text>
                  </View>
                </TouchableItem>
              ))}
            </View>
          </ScrollView>

          <View style={styles.bottomButtonsContainer}>
            <View style={styles.amountContainer}>
              <View style={styles.amountButtonsContainer}>
                <TouchableItem onPress={this.onPressDecreaseAmount} borderless>
                  <View style={styles.iconContainer}>
                    <Icon
                      name={MINUS_ICON}
                      size={20}
                      color={Colors.onPrimaryColor}
                    />
                  </View>
                </TouchableItem>

                <Text style={styles.quantity}>{quantity}</Text>

                <TouchableItem onPress={this.onPressIncreaseAmount} borderless>
                  <View style={styles.iconContainer}>
                    <Icon
                      name={PLUS_ICON}
                      size={20}
                      color={Colors.onPrimaryColor}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>

            <Button
              onPress={this.goBack}
              title={`Add $${total.toFixed(2)}`}
              titleColor={Colors.onPrimaryColor}
              height={44}
              color={Colors.primaryColor}
              small
              rounded
            />
          </View>
        </View>
        <SafeAreaView style={styles.bottomArea} />
      </Fragment>
    );
  }
}
