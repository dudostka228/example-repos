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

		this.HealthThreshold = entry.AddSlider("HP Count", 400, 1, 500, 0)

		EventsSDK.on("PostDataUpdate", this.onUpdate.bind(this))
		EventsSDK.on("ModifierCreated", this.onModifierCreated.bind(this))
	}
	private onUpdate(delta: number) {
		if (delta === 0 || !this.State.value || Sleeper.Sleeping) {
		  return
		}
	
		const me   = LocalPlayer
		if (!me?.Hero || !me.Hero.IsAlive) {
		  return
		}
	
		const hpPct = me.HP
		if (hpPct <= this.HealthThreshold.value) {
		  this.abuseArmlet()
		}
	  }
	
	private onModifierCreated(mod: Modifier) {
		if (!this.State.value) {
		  return
		}
	
		if (typeof (mod as any).IsDebuff === "function" && (mod as any).IsDebuff()) {
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
	
		me.CastToggle(arm)
		// const cdMs = arm.ToggleCooldown * 1000
		// const buffDelayMs = 600
		// const totalDelay = cdMs + buffDelayMs
	
		// Sleeper.Sleep(totalDelay)
	
		me.CastToggle(arm)
	}
}
	
new MyMenu()