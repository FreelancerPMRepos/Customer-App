import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width;

const height = Dimensions.get('window').height;

const Colors = {
    black: '#1A1919',
    white: '#FFFFFF',
    greyLight: '#171717',
};

const BASE_URL = `https://haircut.winayak.com/api`

const IMAGE_URL = `https://haircut.winayak.com/img`

const isValidEmail = value => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(value) == false) {
      //console.log("Email is Not Correct");
      return false;
    } else {
      //console.log("Email is Correct");
      return true;
    }
  };

export {
    width,
    height,
    Colors,
    BASE_URL,
    isValidEmail,
    IMAGE_URL
}