import React, {useState} from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  StyleSheet
} from "react-native";


import MyInputText from "../components/MyInputText";
import MySingleButton from "../components/MySingleButton";
import DatabaseConnection from "../database/db-connection";
import { useNavigation } from "@react-navigation/native";
const db = DatabaseConnection.getConnection();


const User = () => {
    // estados para los campos del formulario
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [findName, setFindName] = useState("");

    const navigation = useNavigation();

    // metodo para setear los estados
    const handleName = (name) => {
        setName(name);
    }

    const handleLastName = (lastName) => {
    setLastName(lastName);
    }

    const handleDocumentNumber = (documentNumber) => {
    setDocumentNumber(documentNumber);
    }

    const handleFindName = (findName) => {
    setFindName(findName);
    }
  
    const addUser = () => {
        // llamar a la validacion de datos
        // si la validacion es correcta
        // llamar al metodo de guardar
        console.log("### add user ###");
    
        if(validateData()){
          console.log("### save user ###");
          // llamar a la db y guarar los datos
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO users (name, lastName, documentNumber) VALUES (?, ?, ?)',
              [name, lastName, documentNumber],
              (tx, results) => {
                if(results.rowsAffected > 0){
                  Alert.alert("Exito", "Usuario registrado correctamente", [
                    {
                      text: "Ok",
                      onPress: () => navigation.navigate("HomeScreen"),
                    }
                  ],
                  {
                    cancelable: false
                  } );
                  clearData();
                }else{
                  Alert.alert("Error", "Error al registrar el usuario");
                }
              }
            )
          });
        }
    }

    const editUser = () => {
      if (validateData()) {
        db.transaction((tx) => {
          tx.executeSql(
            "UPDATE users set name=?, lastName=?, documentNumber=? WHERE id=?",
            [name, lastName, documentNumber, findName],
            (_, results) => {
              if (results.rowsAffected > 0) {
                clearData();
                Alert.alert("Exito", "Usuario actualizado correctamente", [
                  {
                    text: "Ok",
                    onPress: () => navigation.navigate("HomeScreen"),
                  },
                  {
                    cancelable: false,
                  }
                ]);
              } else {
                Alert.alert("Error", "Error al actualizar el usuario");
              }
            }
          )
        })
      }
    };

   

      const deleteUser = () => {
        if(!name && !name.length && name === ""){
          Alert.alert("Error", "El nombre de usuario es obligatorio");
          return false;
        }

        db.transaction((tx) => {
          tx.executeSql(
            'DELETE FROM users WHERE name = ?',
            [name],
            (tx, results) => {
              console.log("Results", results.rowsAffected);
              if(results.rowsAffected > 0){
                Alert.alert("Exito", "Usuario borrado correctamente", [
                  {
                    text: "Ok",
                    onPress: () => navigation.navigate("HomeScreen"),
                  }
                ],
                {
                  cancelable: false
                }
                );
              } else {
                Alert.alert("Error", "El usuario no existe", [
                  {
                    text: "Ok"
                  }
                ],
                {
                  cancelable: false
                }
                )
              }
            }
          );
        });
      }

      const handleUserName = (name) => {
        setName(name);
      }
    
      

    const clearUsernameSearch = () => {
      setFindName("");
    }
    const searchName = () => {
      if(!findName.trim() && findName === ""){
        Alert.alert("Error", "El nombre de usuario es requerido");
        return;
      }
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM users WHERE id = ?",
          [findName],
          (_, results) => {
            if(results.rows.length > 0) {
              const user = results.rows.item(0);
              setName(user.name);
              setLastName(user.lastName);
              setDocumentNumber(user.documentNumber);
            }else {
              Alert.alert("Error", "Usuario no encontrado");
              clearUsernameSearch();
            }
          }
        )
      });
  
    };

    // metodo validar datos
    const validateData = () => {
        if(name === "" && !name.trim()){
        Alert.alert("Error", "Debe ingresar nombre");
        return false;
        }

        if(lastName === "" && !lastName.trim()){
        Alert.alert("Error", "Debe ingresar apellido");
        return false;
        }

        if(documentNumber === "" && !documentNumber.trim()){
            Alert.alert("Error", "Debe ingresar numero de documento");
            return false;
            }
        
        return true;
    }

    const clearData = () => {
      setName("");
      setLastName("");
      setDocumentNumber("");
    };

    return (
        <SafeAreaView style={styles.container}>         
          <View style={styles.viewContainer}>
            <View style={styles.generalView}>
              <ScrollView>
                <KeyboardAvoidingView>
                  <MyInputText 
                    placeholder="Nombre"
                    onChangeText={handleName}
                    value={name}
                    />
    
                  <MyInputText
                    placeholder="Apellido"
                    onChangeText={handleLastName}
                    value={lastName}
                  />
    
                  <MyInputText
                    placeholder="Numero de Documento"
                    onChangeText={handleDocumentNumber}
                    value={documentNumber}
                  />
    
                  <MySingleButton
                    title="Registrar Usuario"
                    btnColor="green"
                    onPress={addUser}
                  />

                  <MySingleButton
                    title="Modificar"
                    btnColor="orange"
                    onPress={editUser}
                  />

                    <MyInputText 
                    placeholder="Id de Usuario"
                    onChangeText={handleFindName}
                    value={findName}
                    />

                    <MySingleButton
                    title="Buscar"
                    btnColor="blue"
                    onPress={searchName}
                  />
    
                </KeyboardAvoidingView>
                <Text textValue="Busqueda de Usuario" textStyle={styles.textStyle}/>
                <KeyboardAvoidingView>
                  <MyInputText
                    placeholder="Nombre de usuario"
                    onChangeText={handleUserName}
                    value={name}
                    styles={styles.inputStyle}
                  />
                  <MySingleButton
                    title="Borrar"
                    onPress={deleteUser}
                  />
                </KeyboardAvoidingView>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      )
    };
    

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  generalView: {
    flex: 1,
  },
  inputStyle: {
    padding: 10,
  },
  textStyle: {
    padding: 10,
    marginLeft: 25,
    color: 'black',
  },
})

export default User;