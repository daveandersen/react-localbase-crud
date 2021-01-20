const worker = () => {
    onmessage = e => {
        switch (e.data.type) {
            case "Get Name":
                console.log(e.data.value)
                postMessage(e.data.value)
                break;

            default:
                console.log("Hello from worker.js");
                postMessage()
                break;
        }
    }
}

export default worker;