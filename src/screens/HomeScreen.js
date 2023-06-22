import React, { useEffect } from "react";
import { View, SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import MyButton from "../components/MyButton";
import DatabaseConnection from "../database/db-connection";

const db = DatabaseConnection.getConnection();

const HomeScreen = ({ navigation }) => {
  const dropDbUser = (tx) => {
    tx.executeSql('DROP TABLE IF EXISTS users', [], null, handleDbError);
  };

  const dropDbInsumo = (tx) => {
    tx.executeSql('DROP TABLE IF EXISTS insumos', [], null, handleDbError);
  };

  const dropDbZone = (tx) => {
    console.log("Elimino zona");
    tx.executeSql('DROP TABLE IF EXISTS zone', [], null, handleDbError);
  };

  const dropDbObs = (tx) => {
    console.log("Elimino obs");
    tx.executeSql('DROP TABLE IF EXISTS observation', [], null, handleDbError);
  };
  
  const createDbUser = (tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50), lastName VARCHAR(50), documentNumber VARCHAR(10))', [],
      null, handleDbError
    );
  };

  const createDbInsumos = (tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS insumos (id INTEGER PRIMARY KEY AUTOINCREMENT, nomIns VARCHAR(50), cantL VARCHAR(4))', [],
      null, handleDbError
    );
  };

  const createDbZone = (tx) => {
    console.log("Creo zona");
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS zone (id INTEGER PRIMARY KEY AUTOINCREMENT, place VARCHAR(50), departament VARCHAR(50), workerCount VARCHAR(10), latitude VARCHAR(10), length VARCHAR(10))', [],
      null, handleDbError
    );
  };
  
  const createDbObs = (tx) => {
    console.log("Creo obs");
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS observation (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo VARCHAR(50), foto VARCHAR(50), latitude VARCHAR(10), length VARCHAR(10))', [],
      null, handleDbError
    );
  };

  const handleDbError = (error) => {
    console.error("Error executing SQL: ", error);
  };

  useEffect(() => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='zone'", [],
        (_, results) => {
          if (results.rows.length === 0) {
            dropDbZone(txn);
            createDbZone(txn);
            console.log("Creo zona");
          } else {
            console.log("Table already exists");
            // TODO: Descomentar si quieres volver a borrar y recrear la tabla
            // dropDbZone(txn);
            // createDbZone(txn);
          }
        },
        handleDbError
      );
    });
  }, []);

  useEffect(() => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'", [],
        (_, results) => {
          if (results.rows.length === 0) {
            dropDbUser(txn);
            createDbUser(txn);
            console.log("Creo user");
          } else {
            console.log("Table already exists");
            // TODO: Descomentar si quieres volver a borrar y recrear la tabla
            // dropDbUser(txn);
            // createDbUser(txn);
          }
        },
        handleDbError
      );
    });
  }, []);

  useEffect(() => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='insumos'", [],
        (_, results) => {
          if (results.rows.length === 0) {
            dropDbInsumo(txn);
            createDbInsumos(txn);
            console.log("Creo insumos");
          } else {
            console.log("Table already exists");
            // TODO: Descomentar si quieres volver a borrar y recrear la tabla
            //dropDbInsumo(txn);
            //createDbInsumos(txn);
          }
        },
        handleDbError
      );
    });
  }, []);

  useEffect(() => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='observation'", [],
        (_, results) => {
          if (results.rows.length === 0) {
            dropDbObs(txn);
            createDbObs(txn);
            console.log("Creo obs");
          } else {
            console.log("Table already exists");
            // TODO: Descomentar si quieres volver a borrar y recrear la tabla
            //dropDbObs(txn);
            //createDbObs(txn);
          }
        },
        handleDbError
      );
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewContainer}>
        <View style={styles.generalContainer}>
          <ScrollView>
            <View>
              <MyButton
                title="Usuarios"
                btnColor="green"
                btnIcon="user-plus"
                onPress={() => navigation.navigate("ABMUser")}
              />
            </View>
            <View>
              <MyButton
                title="Zonas"
                btnColor="orange"
                btnIcon="home"
                onPress={() => navigation.navigate("ABMZone")}
              />
            </View>
            <View>
              <MyButton
                title="Insumos"
                btnColor="blue"
                btnIcon="database"
                onPress={() => navigation.navigate("ABMInsumos")}
              />
            </View>
              <View>
              <MyButton
                title="Observaciones"
                btnColor="grey"
                btnIcon="binoculars"
                onPress={() => navigation.navigate("ABMObs")}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  generalContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default HomeScreen;