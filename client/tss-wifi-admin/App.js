import React from "react";
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { FlatList, StatusBar } from 'react-native';
import Dropdown from "./components/Dropdown";

const Heading = () => {
  return (
    <Text style={styles.baseText}>
      Welcome LahariPraneeth
      <Text style={styles.innerText}> Admin</Text>
    </Text>
  );
};

const Btn = (props) => {
  return (
    <Button
      style={styles.btn}
      onPress={props.handler}
      title={props.text}
      color="#f194ff"
    />
  )
};

function onPressLearnMore() {
  console.log('button pressed');
  fetch('http://localhost:3000/api/health')
    .then((data) => data.json())
    .then((json) => { console.log(JSON.stringify(json)); })
    .catch((err) => { console.log(err); })
}
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Praneeth',
    phone: '8129691950',
    requested_at: new Date().toISOString(),
    state: 'REQUESTED'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Lahari',
    phone: '8129691950',
    requested_at: new Date().toISOString(),
    state: 'REQUESTED'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Sai Badai',
    phone: '8129691950',
    requested_at: new Date().toISOString(),
    state: 'DENIED'
  },
];

const renderItems = (item) => {
  console.log(item);

  const selectHandler = () => {
    console.log('selected handler');
  }

  const rejectHandler = () => {
    console.log('reject handler');
  }
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Text style={styles.itemText}> {item.name} </Text>
        <Text style={styles.itemText}> {item.phone} </Text>
      </div>
      <div style={{ flex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Text style={styles.itemText}> {item.requested_at} </Text>
        <Text style={styles.itemText}> {item.state} </Text>
      </div>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <View style={{ marginBottom: 10 }} >
          <Btn text="Approve" handler={selectHandler} />
        </View>
        <View >
          <Btn text="Reject" handler={rejectHandler} />
        </View>
      </div>
    </div>
  )
};

const Item = ({ item }) => (
  <View style={styles.item}>
    {renderItems(item)}
  </View>
);

export default function App() {
  const items = ['REQUESTED', 'DENIED'];
  const renderItem = ({ item }) => (
    <Item item={item} />
  );
  const dropdownChangeHandler = () => {
    console.log('dropdown changed');
  }
  return (
    <SafeAreaView style={styles.container_1}>
      <Heading />
      <Dropdown items={items} changeHandler={dropdownChangeHandler} />
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container_1: {
    padding: 16, paddingTop: 30,
    display: 'flex',
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight || 0,
  },
  btn: {
    marginBottom: 10
  },
  baseText: {
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: "center"
  },
  itemText: {
    fontWeight: 'normal',
    marginBottom: 10,
    // textAlign: "center"
  },
  innerText: {
    color: 'red'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  container_two: {
    flexDirection: "row",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});






