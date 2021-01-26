const worker = () => {
    self.onmessage = e => {
        var db;
        var request = indexedDB.open("db");

        console.log(request)
        switch (e.data.type) {
            case "Get Username":
                // console.log(e.data.value)
                // self.postMessage(e.data.value)

                request.onsuccess = async function (e) {
                    db = request.result;
                    // console.log(db);

                    var transaction = db.transaction(["users"], "readwrite");
                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {
                        console.log("All done!");
                        // console.log(transaction)
                    };

                    transaction.onerror = function (event) {
                        // Don't forget to handle errors!
                    };

                    var objectStore = transaction.objectStore("users");
                    var request2 = objectStore.getAll();
                    request2.onsuccess = function (event) {
                        console.log(event.target.result)
                    }

                    var cursorRequest = objectStore.openCursor();

                    cursorRequest.onsuccess = function (event) {
                        var cursor = event.target.result;

                        if (cursor) {
                            var value = cursor.value.username;
                            var value1 = cursor.value
                            console.log('Username:', value1.username);
                            postMessage(value1);
                            cursor.continue();
                        } else {
                            console.log('Finished iterating');
                        }
                    }

                    // var request2 = objectStore.add({
                    //     id: 2,
                    //     name: 'ujjwal'
                    // }, 5);
                    // var request2 = objectStore.getAll();
                    // request2.onsuccess = function (event) {
                    //     console.log(event.target.result)
                    //     // event.target.result === customer.ssn;
                    // };

                    //code to verify that the table was created  
                };
                break;
            
            case "Get Password":
                request.onsuccess = async function (e) {
                    db = request.result;
                    // console.log(db);

                    var transaction = db.transaction(["users"], "readwrite");
                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {
                        console.log("All done!");
                        // console.log(transaction)
                    };

                    transaction.onerror = function (event) {
                        // Don't forget to handle errors!
                    };

                    var objectStore = transaction.objectStore("users");
                    var request2 = objectStore.getAll();
                    request2.onsuccess = function (event) {
                        console.log(event.target.result)
                    }

                    var cursorRequest = objectStore.openCursor();

                    cursorRequest.onsuccess = function (event) {
                        var cursor = event.target.result;

                        if (cursor) {
                            var value = cursor.value.password;
                            var value1 = cursor.value
                            console.log('Password:', value);
                            postMessage(value1);
                            cursor.continue();
                        } else {
                            console.log('Finished iterating');
                        }
                    }

                    // var request2 = objectStore.add({
                    //     id: 2,
                    //     name: 'ujjwal'
                    // }, 5);
                    // var request2 = objectStore.getAll();
                    // request2.onsuccess = function (event) {
                    //     console.log(event.target.result)
                    //     // event.target.result === customer.ssn;
                    // };

                    //code to verify that the table was created  
                };
                break;

            case "Get CarID":
                request.onsuccess = async function (e) {
                    db = request.result;
                    // console.log(db);

                    var transaction = db.transaction(["users"], "readwrite");
                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {
                        console.log("All done!");
                        // console.log(transaction)
                    };

                    transaction.onerror = function (event) {
                        // Don't forget to handle errors!
                    };

                    var objectStore = transaction.objectStore("users");
                    var request2 = objectStore.getAll();
                    request2.onsuccess = function (event) {
                        console.log(event.target.result)
                    }

                    var cursorRequest = objectStore.openCursor();

                    cursorRequest.onsuccess = function (event) {
                        var cursor = event.target.result;

                        if (cursor) {
                            var value = cursor.value.carID;
                            var value1 = cursor.value;
                            console.log('Car ID:', value);
                            postMessage(value1);
                            cursor.continue();
                        } else {
                            console.log('Finished iterating');
                        }
                    }

                    // var request2 = objectStore.add({
                    //     id: 2,
                    //     name: 'ujjwal'
                    // }, 5);
                    // var request2 = objectStore.getAll();
                    // request2.onsuccess = function (event) {
                    //     console.log(event.target.result)
                    //     // event.target.result === customer.ssn;
                    // };

                    //code to verify that the table was created  
                };
                break;

            default:
                console.log("Hello from worker.js");
                self.postMessage()
                break;
        }
    }
}
export default worker;