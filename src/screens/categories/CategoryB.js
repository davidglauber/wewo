/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

// import components
import Divider from '../../components/divider/Divider';
import ProductCard from '../../components/cards/ProductCard';

// import colors
import Colors from '../../theme/colors';

// CategoryB Config

// CategoryB Styles
const styles = StyleSheet.create({
  topArea: {flex: 0, backgroundColor: Colors.primaryColor},
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  productList: {
    paddingVertical: 8,
  },
});

export default class CategoryB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [
        {
          imageUri: require('../../assets/img/sandwich_2.jpg'),
          name: 'Subway sandwich',
          price: 8.49,
          quantity: 0,
          discountPercentage: 10,
        },
        {
          imageUri: require('../../assets/img/pizza_1.jpg'),
          name: 'Pizza Margarita 35cm',
          price: 10.99,
          quantity: 0,
        },
        {
          imageUri: require('../../assets/img/cake_1.jpg'),
          name: 'Chocolate cake',
          price: 4.99,
          quantity: 0,
        },
        {
          imageUri: require('../../assets/img//sandwich_2.jpg'),
          name: 'Subway sandwich',
          price: 8.49,
          quantity: 0,
          discountPercentage: 10,
        },
        {
          imageUri: require('../../assets/img/pizza_1.jpg'),
          name: 'Pizza Margarita 35cm',
          price: 10.99,
          quantity: 0,
        },
        {
          imageUri: require('../../assets/img/cake_1.jpg'),
          name: 'Chocolate cake',
          price: 4.99,
          quantity: 0,
        },
      ],
    };
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  onPressRemove = item => () => {
    let {quantity} = item;
    quantity -= 1;

    const {products} = this.state;
    const index = products.indexOf(item);

    if (quantity < 0) {
      return;
    }
    products[index].quantity = quantity;

    this.setState({
      products: [...products],
    });
  };

  onPressAdd = item => () => {
    const {quantity} = item;
    const {products} = this.state;

    const index = products.indexOf(item);
    products[index].quantity = quantity + 1;

    this.setState({
      products: [...products],
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderProductItem = ({item, index}) => (
    <ProductCard
      onPress={this.navigateTo('Product')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      key={index}
      activeOpacity={0.7}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      quantity={item.quantity}
      swipeoutDisabled
    />
  );

  renderSeparator = () => <Divider type="inset" marginLeft={0} />;

  render() {
    const {products} = this.state;

    return (
      <Fragment>
        <SafeAreaView style={styles.topArea} />
        <SafeAreaView style={styles.container}>
          <StatusBar
            backgroundColor={Colors.primaryColor}
            barStyle="light-content"
          />

          <FlatList
            data={products}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
            contentContainerStyle={styles.productList}
          />
        </SafeAreaView>
      </Fragment>
    );
  }
}
