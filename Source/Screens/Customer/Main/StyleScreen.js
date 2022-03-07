import React from 'react';
import { StyleSheet, Text, View, Pressable, Image, TextInput } from 'react-native';
import Header from '../../../Components/Header';
import { Colors } from '../../../Config';
import strings from '../../../Localization/strings';

const StyleScreen = (props) => {
    const _onBack = () => props.navigation.goBack()

    const SearchBarButton = () => {
        return (
            <View>
                <View style={styles.row}>
                    <TextInput placeholder={strings.search_by_styles} style={styles.searchBar} onChangeText={text => setSearch(text)} />
                    <Pressable style={{ borderWidth: 1 }} >
                        <Image source={require('../../../Images/search.png')} style={styles.searchIcon} />
                    </Pressable>
                </View>
                {/* <Pressable style={styles.tagButton} >
                    <Text style={styles.tagButtonText}>{strings.tags}</Text>
                </Pressable> */}
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
export default StyleScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    row: {
        flexDirection: 'row'
    },
    searchBar: {
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 18.5,
        fontFamily: 'Avenir-Book',
        lineHeight: 22,
        fontSize: 16,
        width: '75%'
    },
    searchIcon: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10
    },
})