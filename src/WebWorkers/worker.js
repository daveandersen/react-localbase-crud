const worker = () => {
    self.onmessage = e => {
        switch (e.data.type) {
            case "Get Username":
                console.log(e.data.value)
                self.postMessage(e.data.value)
                var db;
                var request = indexedDB.open("db");
                console.log(request)

                request.onsuccess = async function (e) {
                    db = request.result;

                    var transaction = db.transaction(["users"], "readwrite");
                    // Do something when all the data is added to the database.
                    transaction.oncomplete = function (event) {
                        console.log("All done!");
                    };

                    transaction.onerror = function (event) {
                        // Don't forget to handle errors!
                    };
                    var objectStore = transaction.objectStore("users");
                    var request2 = objectStore.add({
                        id: 2,
                        name: 'ujjwal'
                    }, 5);
                    // var request2 = objectStore.getAll();
                    request2.onsuccess = function (event) {
                        console.log(event.target.result)
                        // event.target.result === customer.ssn;
                    };

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

// const workercode = () => {
//     self.onmessage = function (e) {
//         if (e && e.data.msg === 'Get Username') {

//             console.log("Worker get username", "Username 1")
//             self.postMessage("Username 1");
//             var db;
//             var request = indexedDB.open("db");
//             console.log(request)

//             request.onsuccess = async function (e) {
//                 db = request.result;

//                 var transaction = db.transaction(["users"], "readwrite");
//                 // Do something when all the data is added to the database.
//                 transaction.oncomplete = function (event) {
//                     console.log("All done!");
//                 };

//                 transaction.onerror = function (event) {
//                     // Don't forget to handle errors!
//                 };
//                 var objectStore = transaction.objectStore("users");
//                 var request2 = objectStore.add({
//                     id: 2,
//                     name: 'ujjwal'
//                 }, 4);
//                 // var request2 = objectStore.getAll();
//                 request2.onsuccess = function (event) {
//                     console.log(event.target.result)
//                     // event.target.result === customer.ssn;
//                 };

//                 //code to verify that the table was created  
//             };

//         }
//     }
// };

// let code = workercode.toString();
// code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

// const blob = new Blob([code], { type: "application/javascript" });
// const worker_script = URL.createObjectURL(blob);

// export default worker_script;