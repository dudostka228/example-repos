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

class MyMenu {
	public readonly State: Menu.Toggle
	private readonly HealthThreshold: Menu.Slider

	constructor() {
		const entry = Menu.AddEntry("Armlet Abuse")
		// const node = entry.AddNode("Settings")	
		// node.SortNodes = false

		this.State = entry.AddToggle("Enable", true)
		this.State.OnValue(() => {
			this.OnUpdate()
		})

		this.HealthThreshold = entry.AddSlider("HP Count", 400, 1, 500, 0)
	}

	private OnUpdate() {
		if (!this.State.value || Sleeper.Sleeping) {
			return
		}

		const me = LocalPlayer?.Hero
		if (!me?.Hero || !me.Hero.IsAlive) {
			return
		}

		const HPThreshold = me.HP
		if (this.HealthThreshold.value >= HPThreshold) {
			this.abuseArmlet()
		}
	}

	private abuseArmlet() {
		if (Sleeper.Sleeping) {
			return
		}

		const me   = LocalPlayer?.Hero
		const arm = me.GetItemByClass(item_armlet)
		if (!arm || !arm.CanBeCasted()) {
		  return
		}

		console.log(me, " ", arm)
	}

}
	
new MyMenu()