import * as SQLite from 'expo-sqlite';
const DBNAME = 'database.db';

const DatabaseConnection = {
    
    getConnection: () => SQLite.openDatabase(DBNAME),
    closeConnection: () => SQLite.closeDatabase(DBNAME),
    // a modo de ejemplo
    inserUser: (userName, password, email) => {
        const db = getConnection();
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO users (userName, password, email) VALUES (?, ?, ?)',
                [userName, password, email],
                (tx, results) => {
                    if(results.rowsAffected > 0){
                        return results.rowsAffected;
                    }
                    return 0;
                }
            )
        });
    },   
    inserInsumo: (nomIns, cantL) => {
        const db = getConnection();
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO insumos (nomIns, cantL) VALUES (?, ?)',
                [nomIns, cantL],
                (tx, results) => {
                    if(results.rowsAffected > 0){
                        return results.rowsAffected;
                    }
                    return 0;
                }
            )
        });
    },
    insertZone: (place, departament, workerCount, latitude, length) => {
        const db = getConnection();
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO zone (place, departament, workerCount, latitude, length) VALUES (?, ?, ?, ?, ?)',
                [place, departament, workerCount, latitude, length],
                (tx, results) => {
                    if(results.rowsAffected > 0){
                        return results.rowsAffected;
                    }
                    return 0;
                }
            )
        });
    },
    insertObs: (titulo, foto, latitude, length) => {
        const db = getConnection();
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO observation (titulo, foto, latitude, length) VALUES (?, ?, ?, ?)',
                [titulo, foto, latitude, length],
                (tx, results) => {
                    if(results.rowsAffected > 0){
                        return results.rowsAffected;
                    }
                    return 0;
                }
            )
        });
    }
}

export default DatabaseConnection;