import Toast from 'react-native-simple-toast';

export const showMessageAlert = message => {

    Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM)
};