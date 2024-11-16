import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { PureComponent } from "react";

const { width: screenWidth } = Dimensions.get("window");

export default class SubstanceSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.data = this.sortDataByLength(
      require("../assets/hydrocarbons_pl.json")
    );
    this.state = {
      filteredData: this.data,
    };
    this.typingTimeout = null;
  }

  sortDataByLength = (data) => {
    return data.sort((a, b) => a.value.length - b.value.length);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.searchedSub !== this.props.searchedSub) {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }

      this.typingTimeout = setTimeout(() => {
        this.filterData(this.props.searchedSub);
      }, 300);
    }
  }

  componentDidMount() {
    this.filterData(this.props.searchedSub);
  }

  filterData = (searchQuery) => {
    const filteredData = this.data.filter((item) =>
      item.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
    this.setState({ filteredData });
  };

  onSelectSub = (value) => {
    const { selectSub } = this.props;
    selectSub(value);
  };

  renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => this.onSelectSub(item.value)}>
          <Text style={styles.flatListItemLabel}>{item.value}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { filteredData } = this.state;
    return filteredData.length > 0 ? (
      <View style={styles.flatListView}>
        <FlatList
          windowSize={5}
          horizontal={false}
          nestedScrollEnabled
          data={filteredData}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  flatListView: {
    marginTop: 10,
    width: screenWidth - 30,
    marginLeft: 15,
    borderWidth: 1,
    padding: 10,
    color: "hsl(0, 0%, 96%)",
    border: "1px solid hsl(0, 0%, 96%)",
    borderRadius: 7.5,
    backgroundColor: "hsl(240, 12%, 23%)",
    maxHeight: 200,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  flatListItemLabel: {
    marginLeft: 8,
    fontSize: 16,
    paddingTop: 8,
    paddingBottom: 8,
    color: "hsl(0, 0%, 96%)",
    justifyContent: "center",
    flex: 1,
  },
});
