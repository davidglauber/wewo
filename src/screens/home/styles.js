import styled from 'styled-components/native';

//import icons
import { FontAwesome5 } from '@expo/vector-icons';

import { TextInput } from 'react-native';

// import components
import {Heading6, Heading5, Subtitle1, Subtitle2} from '../../components/text/CustomText';
import { Ionicons as Ionicon } from '@expo/vector-icons';

import {SmallText, Caption} from '../../components/text/CustomText';

import { TextInputMask } from 'react-native-masked-text';

import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';

import  Button  from '../../components/buttons/Button';


export const SafeBackground = styled.SafeAreaView`
    flex:1;
    background: ${props => props.theme.background} 
`;

export const TouchCategory = styled.TouchableOpacity`
    backgroundColor: ${props => props.theme.backgroundColor}
`
export const TextSearch = styled.TextInput`
    border-radius: 20px;
    border-color: ${props => props.theme.color};
    background-color: ${props => props.theme.backgroundColor2};
    color: ${props => props.theme.inversePallete};
    padding-left: 8px;
    padding-right: 51px;
    height: 46px;
    font-size: 16px;
`

export const HeadingAbout = styled(Heading6)`
    margin-top: 8px;
    color: ${props => props.theme.color}
`
export const SubtitleAbout = styled(Subtitle2)`
    color: ${props => props.theme.inversePallete};
    margin-left:15px;
    text-align: center;
    margin-top:5px
`

export const FooterText = styled.Text`
    color: ${props => props.theme.color}; 
    font-weight: 500
`

export const Footer = styled.View`
    width: 360px;
    background-color: ${props => props.theme.background}
`

export const SocialButtonAbout = styled.View`
    background-color: ${props => props.theme.color};
    margin: 8px;
    border-radius: 22px
`

export const ViewCartao = styled.View`
    background-color: ${props => props.theme.background}
`

export const SafeBackgroundPublish = styled.SafeAreaView`
    flex:1;
    background: ${props => props.theme.backgroundPublish}
`;

export const TextDays = styled.Text`
    color: ${props => props.theme.color}; 
    font-weight: 800; 
    padding-top:20px; 
    padding-left: 5px
`

export const TextFilter = styled.Text`
    padding:10px; 
    color: ${props => props.theme.colorFilter}
`

export const FilterUnderContainer = styled.View`
    padding-vertical: 26px;
    padding-horizontal: 24px;
    background-color: ${props => props.theme.background}
`

export const TouchableFilter = styled.TouchableOpacity`
    border-radius:30px; 
    background-color: ${props => props.theme.selectedFilter}; 
    margin: 7px
`

export const TouchableFilterUnselected = styled.TouchableOpacity`
    border-radius:30px; 
    background-color: ${props => props.theme.unselectedFilter}; 
    margin: 7px
`

export const InputForm = styled.TextInput`
    border-bottom-width:0.5px;
    color: ${props => props.theme.inversePallete};
    border-bottom-color: ${props => props.theme.color}
`

export const InputChat = styled.TextInput`
    border-width:1.5px;
    border-radius:20px;
    color: ${props => props.theme.inversePallete};
    padding:10px;
    border-color: ${props => props.theme.color};
`

export const CaptionTerms = styled(Caption)`
    padding-bottom: 12px;
    text-align: left;
    color: ${props => props.theme.inversePallete}
`

export const TextBlock = styled.Text`
    padding-bottom: 24px;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: ${props => props.theme.color};
    letter-spacing: 0.4px;
    text-align: left
`

export const ContainerButton = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    width: 100px;
    background-color: ${props => props.theme.background}
`

export const HeadTerm = styled.Text`
    padding-bottom: 16px;
    font-weight: 700;
    font-size: 16px;
    color: ${props => props.theme.inversePallete};
    letter-spacing: 0.2px;
    text-align: left
`

export const InputFormComponent = styled(UnderlineTextInput)`
    border-bottom-width:0.5px;
    color: ${props => props.theme.inversePallete};
    border-bottom-color: ${props => props.theme.color}
`

export const InputFormMask = styled(TextInputMask)`
    border-bottom-width:0.5px;
    color: ${props => props.theme.inversePallete};
    border-bottom-color: ${props => props.theme.color}
`

export const ChooseOption = styled.TouchableOpacity`
    background-color: ${props => props.theme.color};
    width:22px; 
    height:22px;
    border-radius:30px
`
export const Subtitle2Publish = styled(Subtitle2)`
    margin-left: 5px;
    padding-bottom: 2px; 
    font-weight: 100;
    color: ${props => props.theme.color}; 
    text-align: left
`

export const Subtitle2EditProfile = styled(Subtitle2)`
    color: ${props => props.theme.color};
    text-align: left
`


export const TitleChangeColor = styled.Text`
    color:${props => props.theme.color}
`
export const PublishTouchable = styled.TouchableOpacity`
    background-color: ${props => props.theme.inverseContainerCall};
    width:100px; 
    height:30px; 
    border-radius:30px
`

export const CategoryAndSub = styled.Text`
    font-weight: 700; 
    color: ${props => props.theme.color}; 
    font-size:20px; 
    margin-left:17px; 
    margin-top:10px; 
    margin-bottom:15px
`

export const SafeViewPublish = styled.ScrollView`
    flex:1;
    background: ${props => props.theme.backgroundPublish} 
`;

export const ViewCircle = styled.View`
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background: ${props => props.theme.background}
`

export const SafeAnuncioView = styled.SafeAreaView`
    flex: 1;
    background: ${props => props.theme.background};
    border-top-right-radius: 20px;
    border-top-left-radius: 20px
`


export const AnuncioContainer = styled.TouchableOpacity`
    width: 500px;
    height: 135px; 
    margin-top: 3px; 
    border-radius: 0px; 
    background-color: ${props => props.theme.backgroundColor2};
`


export const CallAndMessageContainer = styled.View`
    flex-direction: row;
    justify-content: space-between; 
    width: 129px; 
    height:80px; 
    padding:20px;  
    background: ${props => props.theme.background}; 
    border-radius:50px
`

export const ReviewView = styled.View`
    padding:30px;  
    background: ${props => props.theme.inverseContainerCall}; 
    border-radius:100px;
    align-items: center
`

export const ViewComment = styled.View`
    background:${props => props.theme.background};
    padding:10px; 
    border-radius: 30px; 
    margin:10px; 
    flex-direction: column; 
    align-items: center; 
    margin-bottom:10px;
    margin-top:50px
`

export const TouchableResponsive = styled.TouchableOpacity`
    flex-direction: row;
    padding:10px; 
    align-items: center; 
    width: 40px; 
    height: 40px; 
    border-radius: 20px; 
    background: ${props => props.theme.inverseContainerCall}
`

export const ButtonIconContainer = styled.View`
    position: absolute;
    top: 16;
    border-radius: 18px;
    background: ${props => props.theme.backgroundColor};
    left: 16
`

export const Title = styled.Text`
    font-size:17px;
    font-weight: bold; 
    color:${props => props.theme.colorTitle2}
`

export const ValueField = styled.Text`
    color:${props => props.theme.colorTitle2};
    font-weight: bold
`

export const ValueFieldPrincipal = styled.Text`
    color:${props => props.theme.inversePallete};
    font-weight: 700
    
`

export const TextDescription = styled(SmallText)`
    padding-bottom: 8px;
    text-align: left;
    color: ${props => props.theme.inversePallete}

`


export const TextDescription2 = styled(SmallText)`
    padding-bottom: 8px;
    text-align: left;
    color: ${props => props.theme.color}

`

export const TextDescription3 = styled(SmallText)`
    padding-bottom: 8px;
    text-align: left;
    color: ${props => props.theme.colorCallAndMessage}

`
export const IconResponsiveCallAndMessage = styled(FontAwesome5)`
    color: ${props => props.theme.colorCallAndMessage}
`

export const TouchableDetails = styled.TouchableOpacity`
    padding-left: 10px; 
    background-color: ${props => props.theme.colorContainerDetails}; 
    width:100px; 
    height:20px; 
    border-radius: 30px;
    align-items: center;
    margin-left: 191px
`

export const TextDetails = styled.Text`
    color: ${props => props.theme.background};
    font-weight: bold;
    paddingRight: 11px
`

export const TextTheme = styled.Text`
    color: ${props => props.theme.inversePallete}
`

export const SwipeLeft = styled.View`
    border-top-width: 0px;
    justify-content: center; 
    align-items: center;
    height: 28px;
    border-radius: 4px;  
    padding-horizontal: 8px; 
    background-color: ${props => props.theme.color}
`

export const SignUpBottom = styled.TouchableOpacity`
    border-radius:5px;
    align-items: center; 
    justify-content: center; 
    width:116px;
    height:27px; 
    background-color: ${props => props.theme.color}
`

export const TextBold = styled.Text`
    color: ${props => props.theme.background};
    font-weight: bold
`

export const TextBoldGolden = styled.Text`
    color: ${props => props.theme.color};
    font-weight: bold
`

export const IconResponsive = styled(FontAwesome5)`
    color: ${props => props.theme.colorTitle}
`

export const IconResponsive2 = styled(FontAwesome5)`
    color: ${props => props.theme.colorTitle2}
`

export const IconResponsiveNOBACK = styled(FontAwesome5)`
    color: ${props => props.theme.color}
`

export const Description = styled.Text`
    text-align: center; 
    font-size:12px; 
    margin-top:10px; 
    margin-right:170px; 
    font-weight: 500; 
    margin-left:25px; 
    color:${props => props.theme.inversePallete}
`
export const Favorite = styled.Text`
    color: ${props => props.theme.inversePallete}; 
    font-size:30px
`

export const Heading = styled(Heading6)`
    font-weight: 700;
    color: ${props => props.theme.color}
`

export const HeadingInverse = styled(Heading6)`
    font-weight: 700;
    color: ${props => props.theme.inversePallete}
`

export const HeadingSetting = styled(Heading6)`
    font-weight: 700;
    padding-top: 16px;
    padding-bottom: 16px;
    font-weight: 700;
    text-align: left;
    color: ${props => props.theme.color}
`

export const NameUserSetting = styled(Subtitle1)`
    font-weight: 500;
    text-align: left;
    color: ${props => props.theme.color};
    font-weight: bold
`

export const Sub1Filter = styled(Subtitle1)`
    color: ${props => props.theme.color};
    text-align: left;
    padding: 16px
`

export const EmailUserSetting = styled(Subtitle1)`
    padding-vertical: 2px;
    color: ${props => props.theme.inversePallete}
`
export const SetTextUserSetting = styled(Subtitle1)`
    padding-vertical: 2px;
    font-size: 14px;
    color: ${props => props.theme.inversePallete};
    font-weight: bold
`
export const SectionHeaderTextSetting = styled(Subtitle1)`
    padding-vertical: 2px;
    text-align: left;
    color: ${props => props.theme.color}
`

export const IconSetting = styled(Ionicon)`
    color: ${props => props.theme.colorSetting}
`

export const IconSettingMAIN = styled(Ionicon)`
    color: ${props => props.theme.colorICONMAIN}
`


export const PlusContainer = styled.TouchableOpacity`
    margin-right:5px; 
    border-radius:25px; 
    align-items: center; 
    justify-content: center;
    width:40px; 
    height:40px; 
    background-color: ${props => props.theme.backgroundColor}
` 

export const PlusIcon = styled(FontAwesome5)`
    color: ${props => props.theme.colorTitle}
` 

export const ItemContainer = styled.View`
    margin-vertical: 4px;
    background: ${props => props.theme.backgroundColor2}
`

export const ViewTopForm = styled.View`
    margin-vertical: 4px;
    margin-horizontal: 12px;
    border-radius: 16px;
    background: ${props => props.theme.backgroundColor2}
`
export const ButtonCustomized = styled(Button)`
    justify-content: center;
    align-items: center;
    background: ${props => props.theme.color};
    border-radius: 4px
`