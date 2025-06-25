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
	private abuseState = 0

	constructor() {
		const entry = Menu.AddEntry("Armlet Abuse")
		this.State = entry.AddToggle("Enable", true)
		this.HealthThreshold = entry.AddSlider("HP Count", 400, 1, 500, 0)
		EventsSDK.on("PostDataUpdate", this.OnUpdate.bind(this))

	}

	private OnUpdate() {
		if (!this.State.value || Sleeper.Sleeping) return

		const me = LocalPlayer?.Hero
		if (!me || !me.IsAlive) return

		const arm = me.GetItemByClass(item_armlet)
		if (!arm || !arm.CanBeCasted()) {
		  return
		}
		
		const hp = me.HP
		const threshold = this.HealthThreshold.value

		if (hp < threshold && this.abuseState === 0) {
			me.CastToggle(arm) // on
			Sleeper.Sleep(600)
			this.abuseState = 1
			return
		}
		
		if (hp >= threshold && this.abuseState === 1) {
			me.CastToggle(arm) // off
			Sleeper.Sleep(600)
			setTimeout(() => {
				const hero = LocalPlayer?.Hero
				const newArm = hero?.GetItemByClass(item_armlet)
				if (hero && newArm && newArm.CanBeCasted()) {
					hero.CastToggle(newArm) // off
					this.abuseState = 0
				}
			}, 600)
		}
	}
}
	
new MyMenu()