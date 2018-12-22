import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globalStyles from '../../../globalStyles';
import { editTrackedItem } from '../../../actions/appState';

class DailyTrackerItem extends React.Component {

    render() {
        const { item } = this.props;

        return (
            <View style={[styles.flexRow, styles.main]}>
                <View style={styles.name}>
                    <Text style={styles.textName}>{item.name.length > 50 ? item.name.split('').slice(0, 50).join('') + '...': item.name}</Text>
                    <Text style={styles.textServings}>{item.servings * item.servingSize} {item.measurement}</Text>
                </View>
                <View style={[styles.flexRow, styles.macros]}>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.proteinColor,
                    }]}>
                        <Text>{parseInt((item.protein * item.servings)*10)/10}g</Text>
                    </Text>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.fatFontColor,
                    }]}>
                        <Text>{parseInt((item.fat * item.servings)*10)/10}g</Text>
                    </Text>
                    <Text style={[styles.macronutrient, {
                        color: globalStyles.carbsFontColor,
                    }]}>
                        <Text>{parseInt((item.carbs * item.servings)*10)/10}g</Text>
                    </Text>
                </View>
                <TouchableOpacity style={styles.icons} onPress={() => this.props.dispatch(editTrackedItem(item))}>
                    <Icon
                        name="edit"
                        type="antdesign"
                        size={35}
                        color={globalStyles.colors.listIcon}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    main: {
        borderWidth: 0.5,
        borderColor: globalStyles.colors.four,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        padding: '1%',
        height: 70,
    },
    flexRow: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    name: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '40%',
    },
    textName: {
        fontSize: 14,
        marginBottom: '1%',
        marginTop: '1%',
        color: globalStyles.fontColor
    },
    textServings: {
        marginBottom: '1%',
        marginTop: '1%',
        marginLeft: '5%',
        marginRight: '5%',
        fontSize: 12,
        color: globalStyles.fontColor
    },
    macros: {
        justifyContent: 'center',   
        alignSelf: 'center',
        width: '15%',
    },
    macronutrient: {
        paddingTop: '25%',
        width: 50,
        height: '100%',
        textAlign: 'center',
        alignSelf: 'center',
    },
    icons: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: 10,
        alignSelf: 'center',
    }
}

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
    }
}

export default connect(mapStateToProps)(DailyTrackerItem);