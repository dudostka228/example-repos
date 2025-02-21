import { EventsSDK } from "github.com/octarine-public/wrapper/index"
import "./global"
import "./translations"

console.log("Hello world!")
EventsSDK.on("GameStarted", () => {
	console.log("Hello world!")
})
