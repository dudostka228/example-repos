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
		// this.State.OnValue(() => {
		// 	this.OnUpdate()
		// })

		this.HealthThreshold = entry.AddSlider("HP Count", 400, 1, 500, 0)

		EventsSDK.on("PostDataUpdate", this.OnUpdate.bind(this))

	}

	private OnUpdate() {
		if (!this.State.value) {
			return
		}
		const me = LocalPlayer?.Hero
		if (!me || !me.IsAlive) {
			return
		}

		if (this.armletPhase === 1 && !Sleeper.Sleeping) {
			const arm = me.GetItemByClass(item_armlet)
			if (arm && arm.CanBeCasted()) {
				me.CastToggle(arm)
			}
			this.armletPhase = 0
		}

		const HPThreshold = me.HP
		console.log(HPThreshold)
		if (400 >= HPThreshold) {
			this.abuseArmlet()
		}
	}

	private armletPhase = 0

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

		me.CastToggle(arm)
		Sleeper.Sleep(600)
		this.armletPhase = 1
	}

}
	
new MyMenu()