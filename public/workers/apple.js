import { findAllByDisplayValue } from "@testing-library/react";

self.addEventListener(
    "message",
    function(e){
        self.postMessage(e.data);
    },
    false
);