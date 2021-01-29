const worker = () => {
    self.onmessage = e => {
        var db;
        var request = indexedDB.open("db");

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
                    var usernameArray = [];
                    request2.onsuccess = function (event) {
                        event.target.result.forEach(element => {
                            usernameArray.push({
                                id: element.id,
                                username: element.username
                            })
                        });
                        postMessage(usernameArray);

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
                    var passwordArray = [];
                    request2.onsuccess = function (event) {
                        event.target.result.forEach(element => {
                            passwordArray.push({
                                id: element.id,
                                password: element.password
                            })
                        });
                        postMessage(passwordArray);

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
                    var carIDArray = [];
                    request2.onsuccess = function (event) {
                        event.target.result.forEach(element => {
                            carIDArray.push({
                                id: element.id,
                                carID: element.carID
                            })
                        });
                        postMessage(carIDArray);
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