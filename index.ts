import { EventsSDK } from "github.com/octarine-public/wrapper/index"

console.log("Hello world!");
console.log("Hello world!")
EventsSDK.on("GameStarted", () => {
	console.log("Hello world!");
})
EventsSDK.on("GameStarted", () => {
	console.log("Hello world!")
})

export function init(ctx) {
    if (ctx && ctx.chat && typeof ctx.chat.send === 'function') {
        ctx.chat.send("1");
    } else {
        console.error("2");
    }
}

