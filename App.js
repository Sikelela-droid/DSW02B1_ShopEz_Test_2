import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { auth, onAuthStateChanged } from './Firebase';

import LoginScreen from './components/Login';
import RegisterScreen from './components/Registration';
import ProductListScreen from './components/ProductList';
import ProductDetailScreen from './components/ProductDetail';
import CartScreen from './components/cartScreen';

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (loading) setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
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
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
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
