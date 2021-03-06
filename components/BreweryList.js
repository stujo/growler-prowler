import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';

import BreweryListItem from './BreweryListItem';

function breweriesFromIds(all, ids) {
  return ids.map(id => all.find(brewery => brewery.id === id));
}

@withNavigation
@connect((data, props) => BreweryList.getDataProps(data, props))
export default class BreweryList extends React.Component {
  static getDataProps(data, props) {
    let { breweries } = data;
    let { all, nearby, visited } = breweries;

    if (props.nearby) {
      breweries = breweriesFromIds(all, nearby);
    } else if (props.visited) {
      breweries = breweriesFromIds(all, visited);
    } else if (props.notVisited) {
      let allBreweryIds = all.map(brewery => brewery.id);
      let notVisited = allBreweryIds.filter(id => !visited.includes(id));
      breweries = breweriesFromIds(all, notVisited);
    } else {
      breweries = all;
    }

    return {
      breweries,
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.breweries !== this.props.breweries;
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.props.breweries.map(brewery => (
            <BreweryListItem
              onPress={() => this._handlePressBrewery(brewery)}
              brewery={brewery}
              key={brewery.name}
            />
          ))
        }

        <StatusBar barStyle="default" />
      </ScrollView>
    );
  }

  _handlePressBrewery = (brewery) => {
    this.props.navigator.push('details', {breweryId: brewery.id});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
});
