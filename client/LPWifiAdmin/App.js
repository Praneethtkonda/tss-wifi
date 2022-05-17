import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { FlatList, StatusBar } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { generateBoxShadowStyle } from "./helper/styles";
// import { displayData } from "./helper/fakeData"
import Button from "./components/Button";
import Reload from "./components/Reload";
import WifiForm  from "./components/WifiForm";
// import { call } from "react-native-reanimated";

const Heading = () => {
  return (
    <Text style={styles.baseText}>
      Welcome LahariPraneeth
      <Text style={styles.innerText}> Admin</Text>
    </Text>
  );
};
const Tab = createBottomTabNavigator();
// function call_api() {
//   console.log('button pressed');
//   fetch('http://localhost:3000/api/fake_data')
//     .then((data) => data.json())
//     .then((json) => { console.log('hello'); })
//     .catch((err) => { data = {}; console.log(err); })
//     .finally(() => Promise.resolve(JSON.stringify(json)))
// }

const renderItems = (item) => {
  const selectHandler = () => {
    console.log('selected handler');
  }

  const rejectHandler = () => {
    console.log('reject handler');
  }

  const LeftSwipeActions = () => {
    return (
      <View>
        <Button onPress={selectHandler} title="Approve" styleProps={{ backgroundColor: 'green' }} visible={false} />
      </View>
    );
  };
  const rightSwipeActions = () => {
    return (
      <View>
        <Button onPress={rejectHandler} title="Reject" styleProps={{ backgroundColor: 'red' }} />
      </View>
    );
  };
  const swipeFromLeftOpen = () => {
    console.log('Swipe from left');
  };
  const swipeFromRightOpen = () => {
    console.log('Swipe from right');
  };
  return (
    <Swipeable
      renderLeftActions={LeftSwipeActions}
      renderRightActions={rightSwipeActions}
      onSwipeableRightOpen={swipeFromRightOpen}
      onSwipeableLeftOpen={swipeFromLeftOpen}
    >
      <View>
        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <Text style={styles.itemHeader}> {item.name} </Text>
          <Text style={styles.itemText}> {item.phone} </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.itemText}> {item.state} </Text>
          <Text style={styles.itemText}> {item.requested_at} </Text>
        </View>
      </View>
    </Swipeable>
  )
};

const Item = ({ item }) => (
  <View style={[styles.item, styles.boxShadow]}>
    {renderItems(item)}
  </View>
);

function MyTabs() {
  return (
    <Tab.Navigator labeled={false} screenOptions={{ tabBarIconStyle: { display: "none" } }}>
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="Requested" children={() => <Main status={'Requested'}/>}/>
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="Approved" children={() => <Main status={'Approved'}/>} />
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="Denied" children={() => <Main status={'Denied'}/>} />
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="SSID details" component={WifiForm} />
    </Tab.Navigator>
  );
}

function Main(props) {
  console.log(props);
  // const items = ['REQUESTED', 'DENIED'];
  let [displayData, setdisplayData] = useState(null);
  useEffect(() => {
    console.log('component mounted');
    fetch('http://localhost:3000/api/fake_data')
    .then((data) => data.json())
    .then((data) => { console.log(data); setdisplayData(data) })
    .catch((err) => { console.log(err); })
  }, []);
  const renderItem = ({ item }) => (
    <Item item={item} />
  );
  const dropdownChangeHandler = () => {
    console.log('dropdown changed');
  }
  const reloadHandler = () => {
    console.log('reload pressed');
  }
  return (
    <SafeAreaView style={styles.container_1}>
      <Heading />
      <Reload onPress={reloadHandler} title='Reload' />
      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container_1: {
    padding: 16, paddingTop: 30,
    display: 'flex',
    backgroundColor: '#fef5e5',
    marginTop: StatusBar.currentHeight || 0,
  },
  baseText: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center"
  },
  itemText: {
    // fontWeight: 'normal',
    marginBottom: 10,
    fontSize: 12,
    // textAlign: "center"
  },
  itemHeader: {
    fontWeight: 'bold',
  },
  innerText: {
    color: 'red'
  },
  item: {
    // backgroundColor: '#f9c2ff',
    // backgroundColor: '#f5f5f5',
    // backgroundColor: 'rgba(249, 105, 14, 0.6)',
    backgroundColor: 'rgba(242, 146, 27, 0.6)',
    // backgroundColor: '#f2921b',
    borderLeftColor: 'green',
    borderLeftWidth: 1,
    borderRightColor: 'red',
    borderRightWidth: 1,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    // paddingVertical: 45,
    // paddingHorizontal: 25,
  },
  boxShadow: generateBoxShadowStyle(0, 2, '#000', 0.25, 4, 5, '#000'),
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
