import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { FlatList, StatusBar } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { generateBoxShadowStyle } from "./helper/styles";
import Button from "./components/Button";
import Reload from "./components/Reload";
import WifiForm  from "./components/WifiForm";

const Heading = () => {
  return (
    <Text style={styles.baseText}>
      Welcome LahariPraneeth
      <Text style={styles.innerText}> Admin</Text>
    </Text>
  );
};
const Tab = createBottomTabNavigator();

const renderItems = (item) => {
  const approveHandler = () => {
    console.log('selected handler');
  }

  const rejectHandler = () => {
    console.log('reject handler');
  }

  const LeftSwipeActions = () => {
    return (
      <View>
        <Button onPress={approveHandler} title="Approve" styleProps={{ backgroundColor: 'green' }} visible={false} />
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
          <Text style={styles.itemText}> {item.status} </Text>
          <Text style={styles.itemText}> {item.ts} </Text>
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
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="Requested" children={() => <Main status={'REQUESTED'}/>}/>
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="Approved" children={() => <Main status={'APPROVED'}/>} />
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="Denied" children={() => <Main status={'DENIED'}/>} />
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="SSID details" component={WifiForm} />
    </Tab.Navigator>
  );
}

// function rRequest(options) {
//   return fetch(options.url, options.headers)
//       .then(data => data.json())
//       .then((json) => {
//           if (json) {
//               if (json.error) {
//                   showTooltip('error', json.error);
//               }
//               else if (json.warn) {
//                   showTooltip('warning', json.warn);
//               }
//           }
//           return Promise.resolve(json);
//       }).catch((err) => {
//           console.error(err);
//           showTooltip('error', 'Some error occured')
//       });
// }

function Main(props) {
  const status = props && props.status || '';
  let [displayData, setdisplayData] = useState(null);
  useEffect(() => {
    fetch('http://localhost:3000/api/all_approval_details', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"status": status}),
      method: "POST"
    })
    .then((data) => data.json())
    .then((data) => { console.log(data); setdisplayData(data.data) })
    .catch((err) => { console.log(err); })
  }, []);
  const renderItem = ({ item }) => (
    <Item item={item} />
  );
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
