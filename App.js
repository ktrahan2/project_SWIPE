<script src="http://localhost:8097"></script>;

import React, { useState, useEffect } from "react";
import { LogBox } from "react-native";
import { LogInForm, SignUpForm, Home } from './src/screens/index';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usersURL = "http://localhost:3000/users/";
const favoritesURL = "http://localhost:3000/friendships/";

const App = () => {
  LogBox.ignoreAllLogs()

  const Stack = createStackNavigator()
  
  const [users, setUsers] = useState([])
  const [favorites, setFavorites] = useState([])
  const [user, setUser] = useState({})
  const [alerts, setAlerts] = useState([])
  
  useEffect(() => AsyncStorage.clear(), [])
  
  const getUsers = () => {

    AsyncStorage.getItem("token")
    .then(token => {
      fetch(usersURL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(users => setUsers(users))
      // console.log(users, "TEST 0 - getUsers")
    })
  }
  
  const signUp = (user) => {

    return fetch(usersURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user })
    })
    .then(response => response.json())
    .then(response => {
      if(response.errors){
        setAlerts(response.errors)
      }
      else {
            AsyncStorage.setItem("token", response.token)
            setUser(response.user),
            setAlerts(["User successsfully created!"]),
            // setFavorites(response.friends)
            setFavorites(response.friendships.friend)
          }
        })
  }

  const removeFavorite = (user, key) => {
        
    AsyncStorage.getItem("token")
    .then(token => {
        fetch(`favoritesURL${key}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    })

    let newFavorites = favorites.filter(fav => fav.id !== favorite.id)
    return setFavorites([newFavorites])
}

  return (
      <NavigationContainer>

          <Stack.Navigator
            initialRouteName="Log In"
          >

            <Stack.Screen
                name="Log In"

                options={{
                  title: "freeAGENT",
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: 'whitesmoke',
                  },
                  headerTitleStyle: {
                    fontFamily: "Caveat-Bold",
                    fontSize: 40,
                    paddingHorizontal: 10
                  },
                  headerTintColor: '#212121',
                }}
                >
                {(props) => <LogInForm
                    {...props}
                    setUser={setUser}
                    setUsers={setUsers}
                    getUsers={getUsers}
                    setFavorites={setFavorites}
                    alerts={alerts}
                    setAlerts={setAlerts}
                    />
                  }
            </Stack.Screen>

            <Stack.Screen
                name="Sign Up"

                options={{
                  title: "freeAGENT",
                  headerStyle: {
                    backgroundColor: 'whitesmoke',
                  },
                  headerTitleStyle: {
                    fontFamily: "Caveat-Bold",
                    fontSize: 40,
                    paddingHorizontal: 10
                  },
                  headerTintColor: '#212121',
                  headerBackTitleVisible: false
                }}
            >
                {(props) => <SignUpForm
                    {...props}
                    signUp={signUp}
                    getUsers={getUsers}
                    alerts={alerts}
                    />
                  }
            </Stack.Screen>

            <Stack.Screen
                name="Home"

                options={{
                  title: "freeAGENT",
                  headerStyle: {
                    backgroundColor: 'whitesmoke',
                  },
                  headerTitleStyle: { 
                    fontFamily: "Caveat-Bold",
                    fontSize: 40,
                    paddingHorizontal: 30
                  },
                  headerTintColor: '#212121',
                  headerBackTitleVisible: false
                }}
            >
                {(props) => <Home
                    {...props}
                    user={user}
                    users={users}
                    setUser={setUser}
                    favorites={favorites}
                    setFavorites={setFavorites}
                    removeFavorite={removeFavorite}
                    />
                  }
            </Stack.Screen>

          </Stack.Navigator>

      </NavigationContainer>
  )
}

export default App
