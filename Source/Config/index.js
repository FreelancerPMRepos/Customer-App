import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width;

const height = Dimensions.get('window').height;

const Colors = {
  black: '#1A1919',
  white: '#FFFFFF',
  greyLight: '#171717',
  spanishGrey: '#9E9E9E',
  blueGreen: '#25CAC8',
  spanishGreyLight: '#979797'
};

const BASE_URL = `https://haircut.winayak.com/api`

const IMAGE_URL = `https://haircut.winayak.com/img`

const isValidEmail = value => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(value) == false) {
    return false;
  } else {
    return true;
  }
};

export const getLetterCounts = str => {
  var letters = 0;
  var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var ar = alphabet.split("");
  for (var i = 0; i < str.length; i++) {
    if (ar.indexOf(str[i]) > -1) {
      letters = letters + 1;
    }
  }
  return letters;
}

export const getCapitalLettersCount = str => {
  var letters = 0;
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var ar = alphabet.split("");
  for (var i = 0; i < str.length; i++) {
    if (ar.indexOf(str[i]) > -1) {
      letters = letters + 1;
    }
  }
  return letters;
}

export const getSmallLettersCount = str => {
  var letters = 0;
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var ar = alphabet.split("");
  for (var i = 0; i < str.length; i++) {
    if (ar.indexOf(str[i]) > -1) {
      letters = letters + 1;
    }
  }
  return letters;
}

export const getNumbersCount = str => {
  var letters = 0;
  var alphabet = "0123456789";
  var ar = alphabet.split("");
  for (var i = 0; i < str.length; i++) {
    if (ar.indexOf(str[i]) > -1) {
      letters = letters + 1;
    }
  }
  return letters;
}

export const getSpecialCharectersCount = str => {
  var allFoundCharacters = str.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);

  return allFoundCharacters
}

export const doesContanisSpeacialCharecters = str => {
  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return format.test(str)
}


export {
  width,
  height,
  Colors,
  BASE_URL,
  isValidEmail,
  IMAGE_URL
}