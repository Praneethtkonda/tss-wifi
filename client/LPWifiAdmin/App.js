import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { FlatList, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { generateBoxShadowStyle } from "./helper/styles";
import DeviceInfo from 'react-native-device-info';

import Button from "./components/Button";
import Reload from "./components/Reload";
import WifiForm  from "./components/WifiForm";

const UPSTREAM_URL = `https://lp-wifi.herokuapp.com`;
// const UPSTREAM_URL = `http://localhost:3005`;

function request_upstream(url, body, cb) {
  return fetch(`${UPSTREAM_URL}/${url}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    method: "POST"
  })
  .then((data) => data.json())
  .then((data) => Promise.resolve([data, null]))
  .catch((err) => Promise.reject([null, err]))
}

/**
 * Helper function to return mac address
 * @returns mac address
 */
async function _getMacAddress() {
  const mac_address = await DeviceInfo.getMacAddress();
  return mac_address;
}

function _visible(curr_status, button) {
  console.log(curr_status, button)
  if (curr_status === 'APPROVED' && button === 'approve') return false
  if (curr_status === 'REJECTED' && button === 'reject') return false
  return true;
}

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

  const approveHandler = async () => {
    const url_prefix = `api/change_approval_status`;
    const mac_address = await _getMacAddress();
    const body = {
      "name": item.name,
      "mobilenumber": item.phone,
      "status": "APPROVED",
      "mac_address": mac_address
    };
    const [data, err] = await request_upstream(url_prefix, body);
    if (err) {
      console.log(err);
    } else {
      console.log('Successfully changed the status');
    }
    // reloadHandler();
  }

  const rejectHandler = async () => {
    const url_prefix = `api/change_approval_status`;
    const mac_address = await _getMacAddress();
    const body = {
      "name": item.name,
      "mobilenumber": item.phone,
      "status": "DENIED",
      "mac_address": mac_address
    };
    const [data, err] = await request_upstream(url_prefix, body);
    if (err) {
      console.log(err);
    } else {
      console.log('Successfully changed the status');
    }
    // reloadHandler();
  }

  const LeftSwipeActions = () => {
    let v = <Button onPress={approveHandler} title="Approve" styleProps={{ backgroundColor: 'green' }}/>
    if(item.status === 'APPROVED') {
      v = <Text> </Text>
    }
    return (
      <View>
        {v}
      </View>
    );
  };
  const rightSwipeActions = () => {
    let v = <Button onPress={rejectHandler} title="Reject" styleProps={{ backgroundColor: 'red' }} />
    if(item.status === 'DENIED') {
      v = <Text> </Text>
    }
    return (
      <View>
        {v}
      </View>
    );
  };
  const swipeFromLeftOpen = () => {};
  const swipeFromRightOpen = () => {};

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
      <Tab.Screen options={{ headerShown: false, tabBarLabelStyle: { fontSize: 15 } }} name="Admin" component={WifiForm} />
    </Tab.Navigator>
  );
}

function Main(props) {
  const status = props && props.status || '';
  let [displayData, setdisplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const contactGod = async () => {
    const url_prefix = `api/all_approval_details`;
    const body = { "status": status }
    const [data, err] = await request_upstream(url_prefix, body);
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      setdisplayData(data.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    contactGod();
  }, []);

  const renderItem = ({ item }) => (
    <Item item={item} />
  );
  const reloadHandler = () => {
    setLoading(true);
    setdisplayData([]);
    console.log('reload pressed', props.status);
    contactGod();
  }

  const showEmptyListView = () =>(
    <View style={styles.emptyView}>
        <Text style={styles.baseText}></Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container_1}>
      <Heading />
      <Reload onPress={reloadHandler} title='Reload' />
      {loading && <Text style={styles.baseText}>Loading...</Text>}
      {displayData &&
        (<FlatList
          style={{ 'flexGrow': 0, 'height': '100%' }}
          ListEmptyComponent={showEmptyListView()}
          data={displayData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />)}
      
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
    marginTop: StatusBar.currentHeight || 0
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
    color: 'blue'
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
  emptyView: {
    marginTop: 100
  }
});
