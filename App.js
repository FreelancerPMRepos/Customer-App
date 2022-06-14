import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Routes from './Source/Navigation/index';
import { Provider } from 'react-redux';
import persist from './Source/Config/store'
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import { StripeProvider } from '@stripe/stripe-react-native';

const persistStore = persist();

const App = () => {

  useEffect(() => {
    createChannel()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        channelId: 'Haircut',
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
      });
    });

    return unsubscribe;
  }, [])

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'Haircut',
      channelName: 'Haircut',
      playSound: false,
      soundName: "default",
      importance: Importance.HIGH,
      vibrate: true,
    })
  }


  return (
    <>
      <StripeProvider
        publishableKey="pk_test_51JVfvXCnUpBJoNDHFLOyPrzRvBarz4oXWCCARl2UDVJJXdvBmCjSNkbrZN2lgqOEIiMpD7dngcowDCMR704rStrs00pQ4HmrW4"
      //   urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      //  merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
      >
        <Provider store={persistStore.store}>
          <PersistGate loading={null} persistor={persistStore.persistor}>
            <Routes />
          </PersistGate>
        </Provider>
      </StripeProvider>
    </>
  )
}

export default App;