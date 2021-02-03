const worker = () => {
    self.onmessage = e => {
        var db;
        var request = indexedDB.open("db");

<<<<<<< HEAD
<<<<<<< HEAD
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
                        console.error("Error has occured");
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
=======
=======
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

>>>>>>> 2d6041497d684427c794a2512d6a78eb6c3e9699
        function getData(type) {
            console.log("Bohay")
            request.onsuccess = async function (e) {
                console.log("Hello")
                db = request.result;

                var transaction = db.transaction(["users"], "readwrite");
                transaction.oncomplete = function (event) {
                    console.log("All done!");
>>>>>>> 0a711a9b4806b4a298e9b43da62f4b668c806004
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