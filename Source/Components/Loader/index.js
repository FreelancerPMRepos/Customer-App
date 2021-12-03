import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View
} from 'react-native';
import { height, width } from '../../Config';


const Loader = () => {
    return (
        <View style={styles.loader}>
            <View style={styles.loaderView}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        </View>
    )
}

export default Loader;

const styles = StyleSheet.create({
    loader: {
        height: height,
        width: width,
        zIndex: 10,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: "center",
        position: 'absolute',
    },
    loaderView: {
        height: height * 0.25
    },
})