import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Routes from './Source/Navigation/index';
import { Provider } from 'react-redux';
import persist from './Source/Config/store'
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';

const persistStore = persist();

const App = () => {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
   //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, [])


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