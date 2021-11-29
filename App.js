import React from 'react';
import Routes from './Source/Navigation/index';
import { Provider } from 'react-redux';
import persist from './Source/Config/store'
import { PersistGate } from 'redux-persist/integration/react'

const persistStore = persist();

const App = () => {
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