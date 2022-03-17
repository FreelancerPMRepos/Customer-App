import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Switch
} from 'react-native';

import { Colors } from '../../../Config';
import Header from '../../../Components/Header'

const ChangeLocation = (props) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const _onBack = () => props.navigation.goBack()

    const renderlocation = () => {
        return (
            <View style={{ marginLeft: 18, marginTop: 31, flexDirection: 'row', justifyContent: 'space-between', marginRight: 33 }}>
                <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium' }}>Auto Location</Text>
                <Switch
                    trackColor={{ false: "#D0CDCD", true: "black" }}
                    thumbColor={isEnabled ? "white" : "white"}
                    ios_backgroundColor="#3e3e3e"
                     onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                <Header leftIcon='back' onLeftIconPress={_onBack} {...props} />
            }
            {
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy' }}>Change Location</Text>
                    </View>
                    {renderlocation()}
                </View>
            }
        </View>
    )
}
export default ChangeLocation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    }
})