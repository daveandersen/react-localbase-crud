const worker = () => {
    self.onmessage = e => {
        var db;
        var request = indexedDB.open("db");

        switch (e.data.type) {
            //XMLHttpRequest
            case "DBInput":
                var users = {}

                var xhr = new XMLHttpRequest();
                xhr.open('GET', "http://localhost:5000/users", true);
                xhr.setRequestHeader('Content-type', 'Application/json; charset=utf-8');
                xhr.onload = function(){
                    users = JSON.parse(xhr.responseText);
                    
                    var data = {}
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

            case "DBUpdate":
                var data = {};
                data.username = e.data.value.username 
                data.password = e.data.value.password
                data.carID = e.data.value.carID 
    
                var json = JSON.stringify(data);
    
                var xhr = new XMLHttpRequest();
                xhr.open('PATCH',`http://localhost:5000/users/${e.data.value.id}`,true);
                xhr.setRequestHeader('Content-type', 'Application/json; charset=utf-8');
                xhr.onload = function(){
                    if(xhr.readyState === 4 && xhr.status === 200){
                        postMessage('Success');
                    } else {
                        postMessage('Fail');
                    }
                }
                xhr.send(json);
                break;
            
            case "DBDelete":
                var xhr = new XMLHttpRequest();
                xhr.open('DELETE', `http://localhost:5000/users/${e.data.value.id}`, true);
                xhr.setRequestHeader('Content-type', 'Application/json; charset=utf-8');
                xhr.onload = function(){
                    var users = JSON.parse(xhr.responseText);
                    if(xhr.readyState === 4 && xhr.status === 200){
                        postMessage('Success');
                    } else {
                        postMessage('Error');
                    }
                }
                xhr.send(null);
                break;
            
            case "DBClear":
                var xhr = new XMLHttpRequest();
                xhr.open('DELETE', `http://localhost:5000/users`, true);
                xhr.setRequestHeader('Content-type', 'Application/json; charset=utf-8');
                xhr.onload = function(){
                    var users = JSON.parse(xhr.responseText);
                    if(xhr.readyState === 4 && xhr.status === 200){
                        postMessage('Success');
                    } else {
                        postMessage('Error');
                    }
                }
                xhr.send(null);
                break;

            case "DBGetAll":
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
            
            case "DBGetOne":
                var xhr = new XMLHttpRequest();
                console.log(e.data.value.id);
                xhr.open('GET', `http://localhost:5000/users/${e.data.value.id}`, true);
                xhr.setRequestHeader('Content-type', 'Application/json; charset=utf-8');
                xhr.onload = function(){
                    var user = JSON.parse(xhr.responseText);
                    if(xhr.readyState === 4 && xhr.status === 200){
                        postMessage(user);
                    }
                    else {
                        console.error('Error has occured!');
                    }
                }
                xhr.send(null);
                break;
            
            // IndexedDB Operations
            case "IDBGetAll":
                console.log('Get All')
                getData("Get All");
                break;

            case "IDBGetUsername":
                getData("Get Username");
                break;

            case "IDBGetPassword":
                getData("Get Password");
                break;

            case "IDBGetCarID":
                getData("Get CarID");
                break;

            case "IDBCreate":
                addData(e.data.value);
                break;
            
            case "IDBUpdate":
                updateOne(e.data.value)
                break;

            case "IDBDelete":
                deleteOne(e.data.value)
                break;
            
            case "IDBClear":
                clearData();
                break;

            default:
                self.postMessage()
                break;
        }

        //IndexedDB Functions

        function deleteOne(id){
            var r = indexedDB.open("db");
            r.onsuccess = function(event){
                db = event.target.result;
                var transaction = db.transaction(["users"], "readwrite");

                transaction.oncomplete = function(event) {
                    console.log('IndexedDB opened for: updateOne')
                };

                transaction.onerror = function (event) {
                    console.log('Error has occured')
                };

                var objectStore = transaction.objectStore("users");

                var objectStoreRequest = objectStore.delete(id)

                objectStoreRequest.onsuccess = function(event) {
                    console.log('Data deleted')
                    postMessage('Done');
                };

                objectStoreRequest.onerror = function(event){
                    console.log('Error has occured')
                }
            }
        }

        function updateOne(data){
            var r = indexedDB.open("db");
            r.onsuccess = function(event){
                db = event.target.result;
                var updatedData = {id: data.id, username: data.username, password: data.password, carID: data.carID}
                var transaction = db.transaction(["users"], "readwrite");

                transaction.oncomplete = function(event) {
                    console.log('IndexedDB opened for: updateOne')
                };

                transaction.onerror = function (event) {
                    console.log('Error has occured')
                };

                var objectStore = transaction.objectStore("users");

                var objectStoreRequest = objectStore.put(updatedData, data.id)

                objectStoreRequest.onsuccess = function(event) {
                    console.log('Data updated')
                    postMessage('Done');
                };

                objectStoreRequest.onerror = function(event){
                    console.log('Error has occured')
                }
            }
            
        }

        function addData(data){
            request.onsuccess = function(e) {
                db = request.result;
                var transaction = db.transaction(["users"], "readwrite");

                transaction.oncomplete = function(event) {
                    console.log('IndexedDB opened for: addData')
                };

                transaction.onerror = function (event) {
                    console.log('Error has occured')
                };

                var objectStore = transaction.objectStore("users");
            

                var objectStoreRequest = objectStore.add(data, data.id);

                objectStoreRequest.onsuccess = function(event) {
                    console.log('Data added to local storage.')
                    postMessage('Done');
                };

                objectStoreRequest.onerror = function(event){
                    console.log('Error has occured')
                }
            }
            
        }

        function clearData(){
            request.onsuccess = function(e) {
                db = request.result;

                var transaction = db.transaction(["users"], "readwrite");

                transaction.oncomplete = function(event) {
                console.log('IndexedDB opened for: deleteData')
                };

                transaction.onerror = function (event) {
                    // Don't forget to handle errors!
                };

                var objectStore = transaction.objectStore("users");

                var objectStoreRequest = objectStore.clear();

                objectStoreRequest.onsuccess = function(event) {
                    console.log('Data deleted from local storage.')
                    postMessage('Done');
                };
            }
            
        }

        function getData(type) {
            request.onsuccess = function (e) {
                db = request.result;

                var transaction = db.transaction(["users"], "readwrite");
                transaction.oncomplete = function (event) {
                    console.log('IndexedDB opened for: getData')
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

                    default:
                        break;
                }
            }
        }
    }
}

export default worker;