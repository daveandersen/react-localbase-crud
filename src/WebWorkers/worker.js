const worker = () => {
    self.onmessage = e => {
        var db;
        var request = indexedDB.open("db");

        switch (e.data.type) {
            case "Get All":
                getData("Get All");
                break;

            case "Get Username":
                getData("Get Username");
                break;

            case "Get Password":
                getData("Get Password");
                break;

            case "Get CarID":
                getData("Get CarID");
                break;

            case "Create User":
                console.log(e.data.value)
                addData(e.data.value);
                break;

            default:
                console.log("Hello from worker.js");
                self.postMessage()
                break;
        }

        function getData(type) {
            console.log("Bohay")
            request.onsuccess = async function (e) {
                console.log("Hello")
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
                var objectArray = [];
                
                switch (type) {
                    case "Get All":
                        request2.onsuccess = function(event) {
                            postMessage(event.target.result)
                        }
                        break;

                    case "Get Username":
                        console.log("Hi")
                        request2.onsuccess = function (event) {
                            event.target.result.forEach(user => {
                                objectArray.push({
                                    id: user.id,
                                    username: user.username
                                })
                            });
                            postMessage(objectArray);
                        }
                        break;

                    case "Get Password":
                        console.log("Hi")
                        request2.onsuccess = function (event) {
                            event.target.result.forEach(user => {
                                objectArray.push({
                                    id: user.id,
                                    password: user.password
                                })
                            });
                            postMessage(objectArray);
                        }
                        break;

                    case "Get CarID":
                        console.log("Hi")
                        request2.onsuccess = function (event) {
                            event.target.result.forEach(user => {
                                objectArray.push({
                                    id: user.id,
                                    carID: user.carID
                                })
                            });
                            postMessage(objectArray);
                        }
                        break;
                }
            }
        }
    }
}

export default worker;