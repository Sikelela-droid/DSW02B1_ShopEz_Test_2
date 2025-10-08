import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { auth } from './Firebase';

import LoginScreen from './components/Login';
import RegisterScreen from './components/Registration';
import ProductListScreen from './components/ProductList';
import ProductDetailScreen from './components/ProductDetail';
import CartScreen from './components/cartScreen';

const Stack = createStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // Auth stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // App stack
          <>
            <Stack.Screen name="Products" component={ProductListScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Detail' }} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
