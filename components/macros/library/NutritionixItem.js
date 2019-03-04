import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import globalStyles from '../../../globalStyles';
import { addUsdaItem } from '../../../actions/appState';

class NutritionixItem extends React.Component {

    render() {
        const { item } = this.props;
        const { photo, food_name, serving_qty, serving_unit } = item;
        return (
            <View key={item.tag_id} style={styles.main}>
                <View>
                    <Image style={{width: 50, height: 50}} source={{uri: photo.thumb}}/>
                </View>
                <View style={styles.name}>
                    <Text style={styles.nameText}>{food_name.length > 50 ? food_name.split('').slice(0, 50).join('') + '...': food_name}</Text>
                    <Text style={styles.servingSizeText}>{serving_qty} {serving_unit}</Text>
                </View>
                {/* <View style={styles.macros}>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.fatFontColor,
                    }]}>{parseInt(fatPerGram * 1000) / 10}g</Text>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.proteinColor,
                    }]}>{parseInt(proteinPerGram * 1000) / 10}g</Text>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.carbsFontColor,
                    }]}>{parseInt(carbsPerGram * 1000) / 10}g</Text>
                </View> */}
                <View style={styles.buttonsView}>
                    <TouchableOpacity style={styles.icons} 
                    // onPress={() => this.props.dispatch(addUsdaItem(item))}
                    >
                        <Icon
                            name="add"
                            type="antdesign"
                            size={35}
                            color={globalStyles.colors.listIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        height: 60,
        borderWidth: 0.5,
        borderColor: globalStyles.colors.four,
        backgroundColor: 'rgba(0, 0, 50, .5)',
    },
    name: {
        width: '52.5%',
    },
    nameText: {
        color: globalStyles.fontColor,
        fontSize: 14
    },
    servingSizeText: {
        color: globalStyles.fontColor,
        fontSize: 12
    },
    macros: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        height: '100%',
        width: '35%'
    },
    macronutrient: {
        paddingTop: '12.5%',
        width: 40,
        height: '100%',
        textAlign: 'center',
        alignSelf: 'center',
    },
    buttonsView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '12.5%',
    }
}

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
        library: state.dataReducer.data.library
    }
}

export default connect(mapStateToProps)(NutritionixItem);