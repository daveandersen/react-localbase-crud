const worker = () => {
    self.onmessage = e => {
        var db;
        var request = indexedDB.open("db");

        console.log(request)
        switch (e.data.type) {
            case "Get Username":
                request.onsuccess = async function (e) {
                    db = request.result;

                    var transaction = db.transaction(["users"], "readwrite");
                    transaction.oncomplete = function (event) {
                        console.log("All done!");
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
                            console.log('Username:', value);
                            postMessage({
                                id: cursor.value.id,
                                username: cursor.value.username
                            });
                            cursor.continue();
                        } else {
                            console.log('Finished iterating');
                        }
                    }
                };
                break;
            
            case "Get Password":
                request.onsuccess = async function (e) {
                    db = request.result;

                    var transaction = db.transaction(["users"], "readwrite");
                    transaction.oncomplete = function (event) {
                        console.log("All done!");
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
                            console.log('Password:', value);
                            postMessage({
                                id: cursor.value.id,
                                password: cursor.value.password
                            });
                            cursor.continue();
                        } else {
                            console.log('Finished iterating');
                        }
                    }
                };
                break;

            case "Get CarID":
                request.onsuccess = async function (e) {
                    db = request.result;
                    
                    var transaction = db.transaction(["users"], "readwrite");
                    transaction.oncomplete = function (event) {
                        console.log("All done!");
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
                            console.log('Car ID:', value);
                            postMessage({
                                id: cursor.value.id,
                                carID: cursor.value.carID
                            });
                            cursor.continue();
                        } else {
                            console.log('Finished iterating');
                        }
                    }
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