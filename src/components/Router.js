import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {attention, fontOnDark} from '../colors';
import AuthScreen from '../screens/Auth';
import ProfileScreen from '../screens/Profile';
import HomeScreen from '../screens/Home';
import CartScreen from '../screens/Cart';
import CustomIcon from '../components/CustomIcon';

const Tab = createBottomTabNavigator();

function Router({user}) {
    return (
        <Tab.Navigator
            initialRouteName="Goods"
            tabBarOptions={{
                activeTintColor: attention,
            }}
            screenProps={user}>
            {!user && (
                <Tab.Screen
                    name="Login"
                    component={AuthScreen}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <CustomIcon
                                focused={focused}
                                name="ios-log-in"
                                focusedColor={attention}
                                defaultColor={fontOnDark}/>
                        ),
                    }}
                />
            )}
            {user && (
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <CustomIcon
                                focused={focused}
                                name="ios-heart"
                                focusedColor={attention}
                                defaultColor={fontOnDark}/>
                        ),
                    }}
                />
            )}
            <Tab.Screen
                name="Goods"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <CustomIcon
                            focused={focused}
                            name="ios-list"
                            focusedColor={attention}
                            defaultColor={fontOnDark}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <CustomIcon
                            focused={focused}
                            name="ios-cart"
                            focusedColor={attention}
                            defaultColor={fontOnDark}/>
                    ),
                }}
                initialParams={{user}}
            />
        </Tab.Navigator>
    );
}

export default Router;
