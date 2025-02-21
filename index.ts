import { EventsSDK } from "github.com/octarine-public/wrapper/index"
import "./global"
import "./translations"
export * from "C:/github.com/octarine-public/wrapper/wrapper/Imports"

console.log("Hello world!");
EventsSDK.on("GameStarted", () => {
	console.log("Hello world!");
})
