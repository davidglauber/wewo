/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  I18nManager,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import Button from '../../components/buttons/Button';
import {Subtitle1} from '../../components/text/CustomText';


//import firebase
import firebase from '../../config/firebase';


import {Heading6} from '../../components/text/CustomText';


import { FilterUnderContainer, HeadingInverse, Sub1Filter, TextFilter, TouchableFilter, TouchableFilterUnselected, SafeBackground} from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';


// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// SearchFilterB Config
const isRTL = I18nManager.isRTL;

// SearchFilterB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    flex: 1,
    ...Platform.select({
      android: {
        minHeight: Layout.SCREEN_HEIGHT - (56 + 80),
      },
    }),
  },
  formContainer: {
    flex: 1,
  },
  mt8: {
    marginTop: 8,
  },
  subtitle: {
    padding: 16,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 8,
  },
  inputContainer: {
    marginHorizontal: 8,
  },
  small: {
    flex: 1,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});

// SearchFilterB
export default class FilterCartao extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);
    this.state = {
      categorias: [],
      selected:[],
      type:'Estabelecimento',
      selectedStates: [],
      estados: [ 
        {uf: 'AC', estado: 'Acre'},
        {uf: 'AL', estado: 'Alagoas'},
        {uf: 'AM', estado: 'Amazonas'},
        {uf: 'BA', estado: 'Bahia'},
        {uf: 'CE', estado: 'Ceará'},
        {uf: 'DF', estado: 'Distrito Federal'},
        {uf: 'ES', estado: 'Espírito Santo'},
        {uf: 'GO', estado: 'Goías'},
        {uf: 'MA', estado: 'Maranhão'},
        {uf: 'MT', estado: 'Mato Grosso'},
        {uf: 'MS', estado: 'Mato Grosso do Sul'},
        {uf: 'MG', estado: 'Minas Gerais'},
        {uf: 'PA', estado: 'Pará'},
        {uf: 'PB', estado: 'Paraíba'},
        {uf: 'PR', estado: 'Paraná'},
        {uf: 'PE', estado: 'Pernambuco'},
        {uf: 'PI', estado: 'Piauí'},
        {uf: 'RJ', estado: 'Rio de Janeiro'},
        {uf: 'RN', estado: 'Rio Grande do Norte'},
        {uf: 'RS', estado: 'Rio Grande do Sul'},
        {uf: 'RO', estado: 'Rondônia'},
        {uf: 'RR', estado: 'Roraíma'},
        {uf: 'SC', estado: 'Santa Catarina'},
        {uf: 'SP', estado: 'São Paulo'},
        {uf: 'SE', estado: 'Sergipe'},
        {uf: 'TO', estado: 'Tocantins'},
      ]
    };
  }

 async componentDidMount() {
    let e = this;
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );

    //getting categories
    await firebase.firestore().collection('categorias').get().then(function(querySnapshot) {
      let categoriaDidMount = []
      querySnapshot.forEach(function(doc) {
        categoriaDidMount.push(doc.data().title)
      })
      e.setState({categorias: categoriaDidMount})
    })

  };

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    this.keyboardDidHideListener.remove();
  };
  

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };


  renderAndSelectCategory(itemTitle) {
    let selected = this.state.selected;
    let categorias = this.state.categorias;
    let array = [];

    var index = categorias.indexOf(itemTitle)


    categorias.splice(index, 1)
    array.push(itemTitle);

    if(selected.length <= 0) {
      this.setState({selected: array})
    } 

    else if(selected.length >= 10) {
      alert('Você só pode escolher até 10 categorias diferentes!')
    } else {
      this.setState({selected: selected.concat(array)})
    }
    console.log('LISTA DE SELECIONADOS: ' + selected)
  }

  renderAndSelectStates(itemUF) {
    let selected = this.state.selectedStates;
    let estados = this.state.estados;
    let array = [];

    var index = estados.indexOf(itemUF)


    estados.splice(index, 1)
    array.push(itemUF);

    if(selected.length <= 0) {
      this.setState({selectedStates: array})
    } 

    else if(selected.length >= 10) {
      alert('Você só pode escolher até 10 estados diferentes!')
    } else {
      this.setState({selectedStates: selected.concat(array)})
    }
    console.log('LISTA DE SELECIONADOS: ' + this.state.selectedStates)
  }


  reuploadCategoriesToList(itemTitle) {
    let selected = this.state.selected;
    let categorias = this.state.categorias;
    let array = [];

    var index = selected.indexOf(itemTitle)


    selected.splice(index, 1)
    array.push(itemTitle);
    
    if(categorias.length <= 0) {
      this.setState({categorias: array})
    } else {
      this.setState({categorias: categorias.concat(array)})
    }

  }


  reuploadStatesToList(itemTitle) {
    let selected = this.state.selectedStates;
    let estados = this.state.estados;
    let array = [];

    var index = selected.indexOf(itemTitle)


    selected.splice(index, 1)
    array.push(itemTitle);
    
    if(estados.length <= 0) {
      this.setState({estados: array})
    } else {
      this.setState({estados: estados.concat(array)})
    }

  }


  render() {
    const {
      categorias,
      estados,
      selectedStates,
      selected
    } = this.state;

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "light-content" : "dark-content"}
        />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <HeadingInverse>Filtro de Cartão</HeadingInverse>
            </View>
            <Sub1Filter>Qual tipo de Profissional?</Sub1Filter>
            <View style={styles.rowWrap}>
                <View>
                  { this.state.type == 'Estabelecimento' &&
                    <View style={{flexDirection:'row'}}>
                      <TouchableFilterUnselected onPress={() => this.setState({type: 'Autonomo'})}>
                        <TextFilter style={{color:'black'}}>Autônomo</TextFilter>
                      </TouchableFilterUnselected>

                      <TouchableFilter>
                        <TextFilter>Estabelecimento</TextFilter>
                      </TouchableFilter>
                    </View>
                  }

                  { this.state.type == 'Autonomo' &&
                    <View style={{flexDirection:'row'}}>
                      <TouchableFilter>
                        <TextFilter>Autônomo</TextFilter> 
                      </TouchableFilter>

                      <TouchableFilterUnselected onPress={() => this.setState({type: 'Estabelecimento'})}>
                        <TextFilter style={{color:'black'}}>Estabelecimento</TextFilter>
                      </TouchableFilterUnselected>
                    </View>
                  }
                </View>
            </View>

            <Sub1Filter style={styles.mt8}>Escolha a categoria abaixo</Sub1Filter>
            <ScrollView contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap',   justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 16}}>
              {categorias.map((item) => (
                <View>
                    <TouchableFilterUnselected onPress={() => this.renderAndSelectCategory(item)}>
                      <TextFilter>{item}</TextFilter>
                    </TouchableFilterUnselected>
                </View>
              ))}
            </ScrollView>

            <Sub1Filter style={styles.mt8}>Escolha o Estado abaixo</Sub1Filter>
            <ScrollView  contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap',   justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 16}}>
              {estados.map((item) => (
                <View>
                    <TouchableFilterUnselected onPress={() => this.renderAndSelectStates(item.uf)}>
                      <TextFilter>{item.estado}</TextFilter>
                    </TouchableFilterUnselected>
                </View>
              ))}
            </ScrollView>
          </View>


          <FilterUnderContainer>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                {selected.map((item) => (
                  <View>
                      <TouchableFilter key={item.id} onPress={() => this.reuploadCategoriesToList(item)}>
                        <TextFilter>{item}</TextFilter>
                      </TouchableFilter>
                  </View>
                ))}
            </ScrollView>


            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                {selectedStates.map((item) => (
                  <View>
                      <TouchableFilter key={item} onPress={() => this.reuploadStatesToList(item)}>
                        <TextFilter>{item}</TextFilter>
                      </TouchableFilter>
                  </View>
                ))}
            </ScrollView>


            <View style={{flexDirection:'row'}}>
              <View>
                {selectedStates.length == 1 ?
                  <Text style={{marginBottom:17, fontSize:11, color:'#DAA520', fontWeight: "bold"}}>{selected.length} categoria selecionada</Text>
                  :
                  <Text style={{marginBottom:17, fontSize:11, color:'#DAA520', fontWeight: "bold"}}>{selected.length} categorias selecionadas</Text>
                }
              </View>


              <View style={{marginLeft:55}}>
                {selectedStates.length == 1 ?
                  <Text style={{marginBottom:17, fontSize:11, color:'#DAA520', fontWeight: "bold"}}>{selectedStates.length} estado selecionado</Text>
                  :
                  <Text style={{marginBottom:17, fontSize:11, color:'#DAA520', fontWeight: "bold"}}>{selectedStates.length} estados selecionados</Text>
                }
              </View>
            </View>

            
            <Button onPress={() => this.props.navigation.navigate('CartaoFiltro', {
              categoriasFiltradas: this.state.selected,
              estadosFiltrados: this.state.selectedStates,
              type: this.state.type
            })} title="Aplicar Filtros" rounded />
          </FilterUnderContainer>
        </KeyboardAwareScrollView>
      </SafeBackground>
    );
  }
}
