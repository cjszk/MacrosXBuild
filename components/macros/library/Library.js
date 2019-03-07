import React from "react";
import { connect } from "react-redux";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";
import { stringify } from "query-string";
import moment from "moment";
import hmacsha1 from "hmacsha1";
import globalStyles from "../../../globalStyles";
import LibraryItem from "./LibraryItem";
import { toggleTab } from "../../../actions/appState";
import FatSecretItem from "./FatSecretItem";
import {
  API_PATH,
  ACCESS_KEY,
  APP_SECRET,
  OAUTH_VERSION,
  OAUTH_SIGNATURE_METHOD
} from "../keys";

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      apiSearchItems: [],
      failedSearch: false,
      loading: false,
      searchCount: 0
    };
    this.timeout;
  }
  getOauthParameters() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    return {
      oauth_consumer_key: ACCESS_KEY,
      oauth_nonce: `${timestamp}${Math.floor(Math.random() * 1000)}`,
      oauth_signature_method: OAUTH_SIGNATURE_METHOD,
      oauth_timestamp: timestamp,
      oauth_version: OAUTH_VERSION
    };
  }

  getSignature(queryParams, httpMethod = "GET") {
    const signatureBaseString = [
      httpMethod,
      encodeURIComponent(API_PATH),
      encodeURIComponent(stringify(queryParams))
    ].join("&");
    const signatureKey = `${APP_SECRET}&`;
    return hmacsha1(signatureKey, signatureBaseString);
  }

  makeApiCall(methodParams, httpMethod = "GET") {
    const queryParams = {
      ...this.getOauthParameters(),
      ...methodParams,
      format: "json"
    };
    queryParams["oauth_signature"] = this.getSignature(queryParams, httpMethod);
    return fetch(`${API_PATH}?${stringify(queryParams)}`, {
      method: httpMethod
    });
  }

  async search(query, maxResults = 10) {
    this.setState({ searchQuery: query });
    const methodParams = {
      method: "foods.search",
      max_results: maxResults,
      search_expression: query
    };
    await this.makeApiCall(methodParams)
      .then(res => res.json())
      .then(res => {
        this.setState({
          apiSearchItems: res.foods
        });
      });
  }

  //   async getFoodInfo(food) {
  //     const methodParams = {
  //       method: "food.get",
  //       food_id: food.food_id
  //     };
  //     await this.makeApiCall(methodParams)
  //       .then(res => res.json())
  //       .then(res => {
  //         if (res && res.food) {
  //             console.log(res.food)
  //           const nutritionPath = Object.keys(res.food).includes("servings")
  //             ? res.food.servings.serving[0]
  //             : null;

  //           if (nutritionPath) {
  //             const item = {
  //               name: res.food.food_name,
  //               protein: Object.keys(nutritionPath).includes("protein")
  //                 ? nutritionPath.protein
  //                 : 0,
  //               carbs: Object.keys(nutritionPath).includes("carbohydrate")
  //                 ? nutritionPath.carbohydrate
  //                 : 0,
  //               fat: Object.keys(nutritionPath).includes("fat")
  //                 ? nutritionPath.fat
  //                 : 0
  //             };
  //             this.setState(prevState => ({
  //               apiSearchItems: [...prevState.apiSearchItems, item]
  //             }));
  //           }
  //         }
  //         else {
  //         console.log(res);
  //         }
  //       });
  //   }

  renderSearchItems() {
    const items = this.state.apiSearchItems.food;
    if (!items || items.length === 0) {
      return <View />;
    }
    const results = items.map((item, index) => {
      return <FatSecretItem key={index} item={item} />;
    });
    return results;
  }

  render() {
    const { library } = this.props;
    const { searchQuery, failedSearch, loading } = this.state;
    const filteredItems = library
      .filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => moment(a.date).format("x") < moment(b.date).format("x"));
    const listItems = filteredItems.map((item, index) => (
      <LibraryItem key={index} item={item} />
    ));
    let renderLoading;
    if (loading)
      renderLoading = (
        <Text style={styles.loading}>
          Loading Search Results from USDA API...
        </Text>
      );

    return (
      <View style={styles.main}>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => this.props.dispatch(toggleTab("newItem"))}
          >
            <Text style={styles.newItem}>New Item</Text>
          </TouchableOpacity>
          <View>
            <TextInput
              placeholder="Search Online"
              placeholderTextColor={globalStyles.placeHolderTextColor}
              style={styles.search}
              value={searchQuery}
              onChangeText={searchQuery => this.search(searchQuery)}
            />
            <Text>Powered by: FatSecret</Text>
          </View>
        </View>
        <View style={styles.list}>
          <ScrollView
            // onScroll={({ nativeEvent }) => {
            //   if (this.reachedBottom(nativeEvent)) {
            //     this.loadMore();
            //   }
            // }}
            scrollEventThrottle={400}
          >
            {listItems}
            {failedSearch ? (
              <Text style={styles.loading}>No search results!</Text>
            ) : (
              this.renderSearchItems()
            )}
            {renderLoading}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = {
  main: {
    height: "125%"
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  search: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: globalStyles.color,
    fontSize: 18,
    width: 200,
    padding: 7.5,
    backgroundColor: "rgba(0, 0, 0, .5)",
    color: globalStyles.fontColor
  },
  list: {
    height: "62.5%"
  },
  advertisement: {
    borderWidth: 0.5,
    borderColor: globalStyles.colors.four,
    backgroundColor: "rgba(0, 0, 0, .5)",
    padding: "1%",
    height: 70,
    width: "100%",
    alignItems: "center"
  },
  loading: {
    // position: 'absolute',
    // bottom: 500,
    // left: '50%',
    // right: '50%',
    textAlign: "center",
    height: 200,
    width: "100%"
  }
};

const mapStateToProps = state => {
  return {
    quickAdd: state.appState.quickAdd,
    library: state.dataReducer.data.library,
    data: state.dataReducer.data
  };
};

export default connect(mapStateToProps)(Library);
