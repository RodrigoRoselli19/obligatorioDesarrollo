import React, { useState } from "react";
import {
    Text,
    View,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    StyleSheet
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MyInputText from "../components/MyInputText";
import MySingleButton from "../components/MySingleButton";
import DatabaseConnection from "../database/db-connection";
import { useNavigation } from "@react-navigation/native";
const db = DatabaseConnection.getConnection();

const Zone = () => {
    // estados para los campos del formulario
    const [place, setPlace] = useState();
    const [departament, setDepartament] = useState("");
    const [workerCount, setWorkerCount] = useState("");
    const [latitude, setLatitude] = useState("");
    const [length, setLength] = useState("");
    const [findZone, setFindZone] = useState("");

    // metodo para setear los estados
    const handlePlace = (place) => {
        setPlace(place);
    }

    const handleDepartament = (departament) => {
        setDepartament(departament);
    }

    const handleWorkerCount = (workerCount) => {
        setWorkerCount(workerCount);
    }

    const handleLatitude = (latitude) => {
        setLatitude(latitude);
    }

    const handleLength = (length) => {
        setLength(length);
    }

    const handleFindZone = (findZone) => {
        setFindZone(findZone);
    }

    const navigation = useNavigation();

    const addZone = () => {
        if (validateData()) {
            db.transaction(
                function (tx) {
                    tx.executeSql(
                        "INSERT INTO zone (place, departament, workerCount, latitude, length) VALUES (?, ?, ?, ?, ?)",
                        [place, departament, workerCount, latitude, length],
                        function (_, results) {
                            if (results.rowsAffected > 0) {
                                Alert.alert("Exito", "Zona registrada correctamente", [
                                    {
                                        text: "Ok",
                                    },
                                ]);
                                clearData();
                            } else {
                                Alert.alert("Error", "Error al registrar la zona");
                            }
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

    const editZone = () => {
        if (validateData()) {
            db.transaction(
                function (tx) {
                    tx.executeSql(
                        "UPDATE zone SET place=?, departament=?, workerCount=?, latitude=?, length=? WHERE id=?",
                        [place, departament, workerCount, latitude, length, findZone],
                        function (_, results) {
                            if (results.rowsAffected > 0) {
                                clearData();
                                Alert.alert("Exito", "Zona actualizada correctamente", [
                                    {
                                        text: "Ok",
                                    },
                                ]);
                            } else {
                                Alert.alert("Error", "Error al actualizar la zona");
                            }
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

    const deleteZone = () => {
        if (findZone === "" || !findZone.trim()) {
            Alert.alert("Error", "El ID de la zona es obligatorio");
            return;
        }

        db.transaction(
            function (tx) {
                tx.executeSql(
                    "DELETE FROM zone WHERE id = ?",
                    [findZone],
                    function (tx, results) {
                        console.log("Results", results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            Alert.alert("Exito", "Zona borrada correctamente", [
                                {
                                    text: "Ok",
                                },
                            ]);
                        } else {
                            Alert.alert("Error", "La zona no existe", [
                                {
                                    text: "Ok",
                                },
                            ]);
                            
                        }clearData();
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
    };


    // metodo validar datos
    const validateData = () => {
        if (place === "" && !place.trim()) {
            Alert.alert("Error", "Debe ingresar lugar");
            return false;
        }

        if (departament === "" && !departament.trim()) {
            Alert.alert("Error", "Debe ingresar departamento");
            return false;
        }

        if (workerCount === "" && !workerCount.trim()) {
            Alert.alert("Error", "Debe ingresar cantidad de departamentos");
            return false;
        }

        if (latitude === "" && !latitude.trim()) {
            Alert.alert("Error", "Debe ingresar latitud");
            return false;
        }

        if (length === "" && !length.trim()) {
            Alert.alert("Error", "Debe ingresar Longitud");
            return false;
        }

        return true;
    }

    const clearData = () => {
        setPlace("");
        setDepartament("");
        setWorkerCount("");
        setLatitude("");
        setLength("");
        setFindZone("");
    };

    const searchZone = () => {
        if (!findZone.trim() && findZone === "") {
            Alert.alert("Error", "El id de la zona es requerido");
            return;
        }
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM zone WHERE id = ?",
                [findZone],
                (_, results) => {
                    if (results.rows.length > 0) {
                        const zone = results.rows.item(0);
                        setPlace(zone.place);
                        setDepartament(zone.departament);
                        setWorkerCount(zone.workerCount);
                        setLatitude(zone.latitude);
                        setLength(zone.length);
                    } else {
                        Alert.alert("Error", "Zona no encontrada");
                    }
                }
            )
        })
        clearData();
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.viewContainer}>
                <View style={styles.generalView}>
                    <ScrollView>
                        <KeyboardAvoidingView>
                            {/** <MyInputText
                                placeholder="Lugar"
                                onChangeText={handlePlace}
                                value={place}
                            />*/}
                            <Picker
                                selectedValue={place}
                                style={{ left: 15, height: 50, width: 200 }}
                                onValueChange={(handlePlace) => setPlace(handlePlace)}
                                >
                                <Picker.Item label="Estancia" value="Estancia" />
                                <Picker.Item label="Quinta" value="Quinta" />
                                <Picker.Item label="Plantacion" value="Plantacion" />
                            </Picker>
                            <MyInputText
                                placeholder="Departamento"
                                onChangeText={handleDepartament}
                                value={departament}
                            />

                            <MyInputText
                                placeholder="Cantidad empleados"
                                onChangeText={handleWorkerCount}
                                value={workerCount}
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
                                title="Registrar Zona"
                                btnColor="green"
                                onPress={addZone}
                            />

                            <MySingleButton
                                title="Modificar Zona"
                                btnColor="orange"
                                onPress={editZone}
                            />

                            <MySingleButton
                                title="Borrar"
                                onPress={deleteZone}
                            />

                            <MyInputText
                                placeholder="Id de Zona"
                                onChangeText={handleFindZone}
                                value={findZone}
                            />

                            <MySingleButton
                                title="Buscar"
                                btnColor="blue"
                                onPress={searchZone}
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

export default Zone;

