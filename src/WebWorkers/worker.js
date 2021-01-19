const worker = () => {
    onmessage = e => {
        switch(e.data.type){
            case "Input":
                console.log(e.data.value)
                postMessage('Hello!')
                break;
            default:
                console.log('Hello from worker.js')
                postMessage()
                break;
        }
        // console.log('worker.js: Message received from main script', e.data)
        // postMessage('Hello Main')
    }
}

export default worker;