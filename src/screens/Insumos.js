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

const Insumos = () => {
    const [nomIns, setInsumo] = useState("");
    const [cantL, setCant] = useState("");
    const [SearchInsum, setSInsum] = useState("");

    const navigation = useNavigation();

    const handleNomIns = (nomIns) => {
        setInsumo(nomIns);
    }
    const handleCantidad = (cantL) => {
        setCant(cantL);
    };

    const handleSearchIns = (SearchInsum) => {
        setSInsum(SearchInsum);
        };
        
        const addInsumo = () => {
          if (validateData()) {
              db.transaction(
                  function (tx) {
                      tx.executeSql(
                          "INSERT INTO insumos (nomIns, cantL) VALUES (?, ?)",
                          [nomIns, cantL],
                          function (_, results) {
                              if (results.rowsAffected > 0) {
                                  Alert.alert("Exito", "Insumo registrada correctamente", [
                                      {
                                          text: "Ok",
                                      },
                                  ]);
                                  clearData();
                              } else {
                                  Alert.alert("Error", "Error al registrar el insumo");
                              clearData();}
                          },
                          function (tx, error) {
                              handleDbError(error);
                          }
                      );
                  },
                  function (error) {
                      handleDbError(error);
                  }
              );
          }
      };

    const editInsumo = () => {
        if(validateData()) {
            db.transaction((tx) => {
                tx.executeSql(
                    "UPDATE insumos SET nomIns=?, cantL=? WHERE id=?",
                    [nomIns, cantL, SearchInsum],
                    (_, results) => {
                        if(results.rowsAffected > 0) {
                            clearData();
                            Alert.alert("Exito","Insumo modificado correctamente", [
                                {
                                    text: "ok",
                                    onPress: () => navigation.navigate("HomeScreen")
                                    
                                },
                                {
                                    cancelable: false,
                                }
                            ]);
                        } else{
                            Alert.alert("Error","Error al modificar insumo");
                        }clearData();
                    }
                )
            })
        }
    };

    const deleteInsumo = () => {
        if(nomIns.trim() && nomIns === ""){
          Alert.alert("Error", "El id de insumo es obligatorio");
          return false;
        }

        db.transaction(
          function(tx) {
          tx.executeSql(
            'DELETE FROM insumos WHERE nomIns = ?',
            [nomIns],
            function (tx, results){
              console.log("Results", results.rowsAffected);
              if(results.rowsAffected > 0){
                Alert.alert("Exito", "Insumo borrado correctamente", [
                  {
                    text: "Ok",
                   
                  },
                ]);
              } else {
                Alert.alert("Error", "El insumo no existe", [
                  {
                    text: "Ok"
                  },
                ]);
              }clearData();
            },
            function(tx, error){
              handleDbError(error);
            }
          );
        },
        function(error){
          handleDbError(error);
        });
      };
    
      const searchInsumo = () => {
        if(!SearchInsum.trim() && SearchInsum === ""){
          Alert.alert("Error", "El id del insumo es requerido");
          return;
        }
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM insumos WHERE id = ?",
            [SearchInsum],
            (_, results) => {
              if(results.rows.length > 0) {
                const insumos = results.rows.item(0);
                setInsumo(insumos.nomIns);
                setCant(insumos.cantL);
              }else {
                Alert.alert("Error", "Insumo no encontrado");
              }
            }
          )
        })
        clearData();
      };
    const validateData = () => {
        if(nomIns === "" && !nomIns.trim()){
        Alert.alert("Error", "Debe ingresar nombre del Insumo");
        return false;
        }

        if(cantL === "" && !cantL.trim()){
        Alert.alert("Error", "Debe ingresar una cantidad en litros");
        return false;
        }
    return true;
}

const clearData = () => {
  setInsumo("");
  setCant("");
  setSInsum("");
};

return(
    <SafeAreaView style={styles.container}>
        <View style={styles.viewContainer}>
            <View style={styles.generalView}>
                <ScrollView>
                    <KeyboardAvoidingView>
                        <MyInputText
                            placeholder="Nombre Insumo"
                            onChangeText={handleNomIns}
                            value={nomIns}
                        />
                        <MyInputText
                            placeholder="Cantidad en Litros"
                            onChangeText={handleCantidad}
                            value={cantL}
                        />
                        <MySingleButton
                            title="Ingresar Insumo"
                            btnColor="green"
                            onPress={addInsumo}
                        />
                        <MySingleButton
                        title="Modificar"
                        btnColor="orange"
                        onPress={editInsumo}
                       />
                        <MySingleButton
                        title="Borrar"
                        onPress={deleteInsumo}
                        />
                        <MyInputText 
                        placeholder="Id del Insumo"
                        onChangeText={handleSearchIns}
                        value={SearchInsum}
                        />

                        <MySingleButton
                        title="Buscar"
                        btnColor="blue"
                        onPress={searchInsumo}
                        />
                </KeyboardAvoidingView>
                </ScrollView>
            </View>
        </View>
    </SafeAreaView>
)
}

export default Insumos;

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