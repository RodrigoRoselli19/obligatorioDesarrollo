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
import { Picker } from "@react-native-picker/picker";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const db = DatabaseConnection.getConnection();

const Observaciones = () => {
    const [titulo, setTitulo] = useState();
    const [foto, setFoto] = useState("");
    const [latitude, setLatitude] = useState("");
    const [length, setLength] = useState("");
    const [SearchObs, setSObs] = useState("");

    const navigation = useNavigation();

    //launchImageLibrary(options? callback)

    //const result = await launchImageLibrary(options?: );

    const handleNomTit = (titulo) => {
        setTitulo(titulo);
    }
    const handleFoto = (foto) => {
        setFoto(foto);
    };

    const handleLatitude = (latitude) => {
        setLatitude(latitude);
    }

    const handleLength = (length) => {
        setLength(length);
    }
    
    const handleSearchObs = (SearchObs) => {
        setSObs(SearchObs);
        };
        
        const addObs = () => {
          if (validateData()) {
              db.transaction(
                  function (tx) {
                      tx.executeSql(
                          "INSERT INTO observation (titulo, foto, latitude, length) VALUES (?, ?)",
                          [titulo, foto, latitude, length],
                          function (_, results) {
                              if (results.rowsAffected > 0) {
                                  Alert.alert("Exito", "Observacion añadida correctamente", [
                                      {
                                          text: "Ok",
                                      },
                                  ]);
                                  clearData();
                              } else {
                                  Alert.alert("Error", "Error al registrar la observacion");
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

    const editObs = () => {
        if(validateData()) {
            db.transaction((tx) => {
                tx.executeSql(
                    "UPDATE observation SET titulo=?, foto=? WHERE id=?",
                    [titulo, foto, latitude, length, SearchObs],
                    (_, results) => {
                        if(results.rowsAffected > 0) {
                            clearData();
                            Alert.alert("Exito","Observacion modificada correctamente", [
                                {
                                    text: "ok",
                                    onPress: () => navigation.navigate("HomeScreen")
                                    
                                },
                                {
                                    cancelable: false,
                                }
                            ]);
                        } else{
                            Alert.alert("Error","Error al modificar observacion");
                        }clearData();
                    }
                )
            })
        }
    };

    const deleteObs = () => {
        if(SearchObs.trim() && SearchObs === ""){
          Alert.alert("Error", "El id de la observacion es obligatorio");
          return false;
        }

        db.transaction(
          function(tx) {
          tx.executeSql(
            'DELETE FROM observation WHERE id = ?',
            [SearchObs],
            function (tx, results){
              console.log("Results", results.rowsAffected);
              if(results.rowsAffected > 0){
                Alert.alert("Exito", "Observacion borrada correctamente", [
                  {
                    text: "Ok",
                   
                  },
                ]);
              } else {
                Alert.alert("Error", "La observacion no existe", [
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
    
      const searchObs = () => {
        if(!SearchObs.trim() && SearchObs === ""){
          Alert.alert("Error", "El id de la observacion es requerido");
          return;
        }
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM observation WHERE id = ?",
            [SearchObs],
            (_, results) => {
              if(results.rows.length > 0) {
                const observation = results.rows.item(0);
                setTitulo(observation.titulo);
                setFoto(observation.foto);
                setLatitude(observation.latitude);
                setLength(observation.length);
              }else {
                Alert.alert("Error", "Observacion no encontrada");
              }
            }
          )
        })
        clearData();
      };
    const validateData = () => {
        if(titulo === "" && !titulo.trim()){
        Alert.alert("Error", "Debe ingresar nombre de la observacion");
        return false;
        }

        if(foto === "" && !foto.trim()){
        Alert.alert("Error", "Debe ingresar una foto");
        return false;
        }
        if(latitude === "" && !latitude.trim()){
            Alert.alert("Error", "Debe ingresar una latitud");
            return false;
            }
        if(length === "" && !length.trim()){
            Alert.alert("Error", "Debe ingresar una longitud");
            return false;
            }    
    return true;
}

const clearData = () => {
  setTitulo("");
  setFoto("");
  setLatitude("");
  setLength("");
  setSObs("");
};

return(
    <SafeAreaView style={styles.container}>
        <View style={styles.viewContainer}>
            <View style={styles.generalView}>
                <ScrollView>
                    <KeyboardAvoidingView>
                        {/*<MyInputText
                            placeholder="Titulo Observacion"
                            onChangeText={handleNomTit}
                            value={titulo}
                        />*/}
                        <Picker
                                selectedValue={titulo}
                                style={{ left: 15, height: 50, width: 300 }}
                                onValueChange={(handleNomTit) => setTitulo(handleNomTit)}
                                >
                                <Picker.Item label="Plaga Detectada" value="Plaga Detectada" />
                                <Picker.Item label="Planta en mal estado" value="Planta en mal estado" />
                                <Picker.Item label="Falta de riego" value="Falta de riego" />
                            </Picker>
                        <MyInputText
                            placeholder="Foto"
                            onChangeText={handleFoto}
                            value={foto}
                        />
                        <MyInputText
                                placeholder="Latitud"
                                onChangeText={handleLatitude}
                                value={latitude}
                            />

                        <MyInputText
                            placeholder="Longitud"
                            onChangeText={handleLength}
                            value={length}
                        />
                        <MySingleButton
                            title="Ingresar Observacion"
                            btnColor="green"
                            onPress={addObs}
                        />
                        <MySingleButton
                        title="Modificar"
                        btnColor="orange"
                        onPress={editObs}
                       />
                        <MySingleButton
                        title="Borrar"
                        onPress={deleteObs}
                        />
                        <MyInputText 
                        placeholder="Id de la observacion"
                        onChangeText={handleSearchObs}
                        value={SearchObs}
                        />

                        <MySingleButton
                        title="Buscar"
                        btnColor="blue"
                        onPress={searchObs}
                        />
                </KeyboardAvoidingView>
                </ScrollView>
            </View>
        </View>
    </SafeAreaView>
)
}

export default Observaciones;

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