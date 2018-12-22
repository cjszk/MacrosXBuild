import React from 'react';
import { connect } from 'react-redux';
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import moment from 'moment';
import globalStyles from '../../../globalStyles';
import LibraryItem from './LibraryItem';
import USDAItem from './usdaItem';
import { toggleTab } from '../../../actions/appState';

// const API_KEY = process.env.REACT_APP_USDA_API_KEY;
const API_KEY = 'N12asrcuD5j7Su6Zy5J8ZtrUtxLahcSPQyR701Mf';

class Library extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            apiSearchItems: [],
            apiSearchItemsInfo: [],
            failedSearch: false,
            loading: false,
            searchCount: 0,
        }
        this.timeout;

    }

    search(searchQuery) {
        this.setState({searchQuery, apiSearchItemsInfo: [], failedSearch: false});
        if (searchQuery.length < 2) return null;
        if (this.timeout) clearInterval(this.timeout);
        const database = 'Standard+Reference';
        const searchUrl = `https://api.nal.usda.gov/ndb/search/?format=json&q=${searchQuery}&ds=${database}&api_key=${API_KEY}`;
        this.timeout = setTimeout(() => {
            this.setState({loading: true});
            fetch(searchUrl, {
                method: "GET",
              }).then((res) => {
                return res.json()
              }).then((result) => {
                if (!Object.keys(result).includes('list')) {
                    this.setState({failedSearch: true, loading: false})
                    return null;
                };
                this.setState({apiSearchItems: result.list.item})
                return result.list.item;
              }).then((items)=> {
                if (!items) return null;
                let urlString = 'https://api.nal.usda.gov/ndb/V2/reports?';
                const count = items.length > 25 ? 25 : items.length;
                let searchCount = 0;
                for (let i=0; i<count; i++) {
                    urlString += `ndbno=${items[i].ndbno}&`;
                    searchCount++;
                }
                urlString += `type=f&format=json&api_key=${API_KEY}`;
                return fetch(urlString, {
                    method: "GET",
                    }).then((res) => {
                        return res.json();
                    }).then((results) => {
                        this.setState({apiSearchItemsInfo: results.foods, loading: false, searchCount})
                    }).catch((err) => console.error(err));
              }).catch((err) => console.error(err));
        }, 1500);
    }

    reachedBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const { searchCount, apiSearchItems } = this.state;
        if (searchCount >= apiSearchItems.length) return null;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height;
      };

    loadMore() {
        const { apiSearchItems, searchCount } = this.state;
        if (!apiSearchItems) return null;
        this.setState({failedSearch: false, loading: true});
        let urlString = 'https://api.nal.usda.gov/ndb/V2/reports?';
        let maxIndex = apiSearchItems.length > searchCount + 25 ? searchCount + 25 : apiSearchItems.length;
        let count = searchCount;
        for (let i=searchCount; i<maxIndex; i++) {
            urlString += `ndbno=${apiSearchItems[i].ndbno}&`;
            count++;
        }
        urlString += `type=f&format=json&api_key=${API_KEY}`;
        return fetch(urlString, {
            method: "GET",
            }).then((res) => {
                return res.json();
            }).then((results) => {
                this.setState(prevState => ({
                    apiSearchItemsInfo: [...prevState.apiSearchItemsInfo, ...results.foods],
                    loading: false,
                    searchCount: count
                }));
            }).catch((err) => console.error(err));
    }

    renderSearchItems() {
        const items = this.state.apiSearchItemsInfo;
        if (!items || items.length === 0) {
            return <View/>;
        };
        return items.filter((item) => item.food.nutrients[0].measures.length !== 0).map((item, index) => {
            return (
                <USDAItem key={index} item={item.food} />
            );
        });
    }
    
    render() {
        const { library } = this.props;
        const { searchQuery, failedSearch, loading } = this.state;
        const filteredItems = library.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => moment(a.date).format('x') > moment(b.date).format('x'));
        const listItems = filteredItems.map((item, index) => <LibraryItem key={index} item={item}/>);
        let renderLoading;
        if (loading) renderLoading = <Text style={styles.loading}>Loading Search Results from USDA API...</Text>

        return (
            <View style={styles.main}>
                <View style={styles.controls}>
                    <TextInput placeholder='Search Online' placeholderTextColor={globalStyles.placeHolderTextColor} style={styles.search} value={searchQuery} onChangeText={(searchQuery) => this.search(searchQuery)}/>
                    <TouchableOpacity onPress={() => this.props.dispatch(toggleTab('newItem'))}>
                        <Text style={styles.newItem}>New Item</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.list}>
                    <ScrollView
                        onScroll={({nativeEvent}) => {
                            if (this.reachedBottom(nativeEvent)) {
                            this.loadMore();
                            }
                        }}
                          scrollEventThrottle={400}>
                        {listItems}
                        {failedSearch ? <Text style={styles.loading}>No search results!</Text> : this.renderSearchItems()}
                        {renderLoading}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = {
    main: {
        height: '125%',
    },
    newItem: {
        fontSize: 18,
        backgroundColor: globalStyles.buttonColor,
        color: globalStyles.buttonTextColor,
        padding: 7.5
    },
    controls: {
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    search: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: globalStyles.color,
        fontSize: 18,
        width: 200,
        padding: 7.5,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        color: globalStyles.fontColor
    },
    list: {
        height: '39.5%'
    },
    loading: {
        // position: 'absolute',
        // bottom: 500,
        // left: '50%',
        // right: '50%',
        textAlign: 'center',
        height: 200,
        width: '100%'
    }
}

const mapStateToProps = state => {
    return {
        quickAdd: state.appState.quickAdd,
        library: state.dataReducer.data.library
    }
}

export default connect(mapStateToProps)(Library);