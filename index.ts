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
	private readonly selector: Menu.ImageSelector

	constructor() {
		const entry = Menu.AddEntry("Имя гл.подпункта")

		const node = entry.AddNode("Имя Подпункта")
		node.SortNodes = false

		this.State = node.AddToggle("Включить", false)

		this.slider = node.AddSlider("Слайдер с числами", 5, 0, 100, 1)

		this.selector = node.AddImageSelector("Элемент", [])

		this.slider.IsHidden = false
		this.selector.IsHidden = false

		this.State.OnValue((call) => {
			this.slider.IsHidden = !call.value
			this.selector.IsHidden = !call.value
		})
	}

}