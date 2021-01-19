import MessageService from '../services/messageService';


const worker = () => {
    onmessage = e => {
        switch (e.data.type) {
            case "Get Name":
                console.log(e.data.value)
                postMessage(e.data.value)
                // MessageService.getAll().then((messages) => {
                //     const inputData = {
                //         id: messages.data.length,
                //         message: e.data.value
                //     }
                //     console.log(inputData)
                //     MessageService.createData(inputData)
                //     postMessage('Sync')
                // }).then(() =>
                //     postMessage('Sync')
                // )
                break;

            default:
                console.log("Hello from worker.js");
                postMessage()
                break;
        }
    }
}

export default worker;