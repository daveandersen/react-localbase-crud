const worker = () => {
    self.onmessage = e => {
        var db;
        var request = indexedDB.open("db");

        console.log(request)
        switch (e.data.type) {
            case "Input User":
                
                var users = {}

                var xhr = new XMLHttpRequest();
                xhr.open('GET', "http://localhost:5000/users", true);
                xhr.setRequestHeader('Content-type', 'Application/json; charset=utf-8');
                xhr.onload = function(){
                    users = JSON.parse(xhr.responseText);
                    let data = {}
                    data.id = users.length
                    data.username = e.data.username 
                    data.password = e.data.password
                    data.carID = e.data.carID 

                    var json = JSON.stringify(data);
                    console.log(json)

                    var xhr2 = new XMLHttpRequest();
                    xhr2.open('POST',"http://localhost:5000/users", true);
                    xhr2.setRequestHeader('Content-type', 'Application/json; charset=utf-8');
                    xhr2.onload = function(){
                        if(xhr2.readyState === 4 && xhr2.status === 201){
                            postMessage("Success");
                        } else {
                            postMessage("Fail");
                        }
                    }
                    xhr2.send(json);
                }
                xhr.send(null);
                break;
            case "Get all users":
                var xhr = new XMLHttpRequest();
                xhr.open('GET', "http://localhost:5000/users", true);
                xhr.setRequestHeader('Content-type', 'Application/json; charset=utf-8');
                xhr.onload = function(){
                    var users = JSON.parse(xhr.responseText);
                    if(xhr.readyState === 4 && xhr.status === 200){
                        postMessage(users);
                    } else {
                        //console.error(users);
                    }
                }
                xhr.send(null);
                break;
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