import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Colors } from '../../../Config';
import Header from '../../../Components/Header';
import strings from '../../../Localization/strings';

const TagSearchScreen = (props) => {
    const _onBack = () => props.navigation.goBack()

    const SearchBarButton = () => {
        return (
            <View>
                <Pressable style={styles.tagButton} >
                    <Text style={styles.tagButtonText}>{strings.tags}</Text>
                </Pressable>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {
                <Header leftIcon={'back'} onLeftIconPress={_onBack} {...props} />
            }
            {SearchBarButton()}
        </View>
    )
}
export default TagSearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    tagButton: {
        backgroundColor: '#010101',
        marginLeft: 20,
        marginTop: 16.5,
        marginRight: 20
    },
    tagButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 18,
        marginTop: 15.50,
        marginBottom: 17,
        fontFamily: 'Avenir-Book',
        lineHeight: 22
    },
})