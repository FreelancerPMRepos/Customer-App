import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Routes from './Source/Navigation/index';
import { Provider } from 'react-redux';
import persist from './Source/Config/store'
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';

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
      <Provider store={persistStore.store}>
        <PersistGate loading={null} persistor={persistStore.persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    </>
  )
}

export default App;