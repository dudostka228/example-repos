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
	private CurrentPhase: "idle" | "reset" = "idle"

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

		const hp = me.HP
		const threshold = this.HealthThreshold.value
		const arm = me.GetItemByClass(item_armlet)
		if (!arm || !arm.CanBeCasted()) return

		const armletOn = arm.ToggledOn

		if (hp < threshold) {
			this.CurrentPhase = "idle"
			if (!armletOn) {
				me.CastToggle(arm)
				Sleeper.Sleep(200)
			}
			return
		}

		if (hp >= threshold && this.CurrentPhase !== "reset") {
			this.CurrentPhase = "reset"
			if (armletOn) {
				me.CastToggle(arm) // off
				Sleeper.Sleep(600)
				setTimeout(() => {
					const refreshed = LocalPlayer?.Hero?.GetItemByClass(item_armlet)
					if (refreshed && refreshed.CanBeCasted()) {
						LocalPlayer.Hero.CastToggle(refreshed) // on
					}
				}, 600)
			}
			return
		}
	}
}
	
new MyMenu()