import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
const Stack = createStackNavigator();
// TODO Importar cada una de las pantallas
import HomeScreen from "../screens/HomeScreen";
import User from "../screens/User";
import Insumos from "../screens/Insumos";
import Zone from "../screens/Zone";
import Observaciones from "../screens/Observaciones";

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* TODO Agregar cada una de las pantallas */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerTitle: "Principal",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />

        <Stack.Screen
          name="ABMUser"
          component={User}
          options={{
            title: "ABM Usuario",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="ABMInsumos"
          component={Insumos}
          options={{
            title: "ABM Insumos",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="ABMZone"
          component={Zone}
          options={{
            title: "ABM Zona",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="ABMObs"
          component={Observaciones}
          options={{
            title: "ABM Obs",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
