import { 
	EventsSDK,
	Menu
 } from "github.com/octarine-public/wrapper/index"

EventsSDK.on("GameStarted", () => {
	console.log("Hello world!")
})

class MyMenu {
	public readonly State: Menu.Toggle
	private readonly slider: Menu.Slider

	constructor() {
		const entry = Menu.AddEntry("Armlet Abuse")

		// const node = entry.AddNode("HP Count")	
		// node.SortNodes = false

		this.State = entry.AddToggle("Включить", true)
		this.State.OnValue(t => {
			console.log("scrpt activated:", t.value)
		})

		this.slider = entry.AddSlider("Слайдер с числами", 400, 1, 500, 0)

		this.slider.IsHidden = false

		this.State.OnValue((call) => {
			this.slider.IsHidden = !call.value
		})
	}

}

new MyMenu()