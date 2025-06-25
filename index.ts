import { 
	EventsSDK,
	Menu,
	Modifier,
	LocalPlayer,
	item_armlet,
	TickSleeper,
	EntityManager
 } from "github.com/octarine-public/wrapper/index"

const Sleeper = new TickSleeper()

console.log("1")
class MyMenu {
	public readonly State: Menu.Toggle
	private readonly HealthThreshold: Menu.Slider

	constructor() {
		const entry = Menu.AddEntry("Armlet Abuse")
		// const node = entry.AddNode("Settings")	
		// node.SortNodes = false
		console.log("2")
		this.State = entry.AddToggle("Enable", true)
		// this.State.OnValue(() => {
		// 	this.OnUpdate()
		// })

		this.HealthThreshold = entry.AddSlider("HP Count", 400, 1, 500, 0)

		EventsSDK.on("PostDataUpdate", this.OnUpdate.bind(this))

		console.log("3")
	}

	private OnUpdate() {
		if (!this.State.value) {
			return
		}
		console.log("4")
		const me = LocalPlayer?.Hero
		if (!me?.Hero || !me.Hero.IsAlive) {
			return
		}
		console.log("5")
		const HPThreshold = me.HP
		console.log(HPThreshold)
		if (400 >= HPThreshold) {
			this.abuseArmlet()
		}
		console.log("6")
	}

	private abuseArmlet() {
		if (Sleeper.Sleeping) {
			return
		}
		console.log("7")
		const me   = LocalPlayer?.Hero
		const arm = me.GetItemByClass(item_armlet)
		if (!arm || !arm.CanBeCasted()) {
		  return
		}
		console.log("8")
		console.log(me, " ", arm)
		console.log("9")
	}

}
	
new MyMenu()