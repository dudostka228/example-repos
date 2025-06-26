import { 
	EventsSDK,
	Menu,
	Modifier,
	LocalPlayer,
	item_armlet,
	TickSleeper,
	Hero,
	GameActivity
 } from "github.com/octarine-public/wrapper/index"

const Sleeper = new TickSleeper()

class MyMenu {
	public readonly State: Menu.Toggle
	private readonly HealthThreshold: Menu.Slider
	private readonly keybind: Menu.KeyBind

	constructor() {
		const entry = Menu.AddEntry("Armlet Abuse")
		this.State = entry.AddToggle("Enable", true)
		this.HealthThreshold = entry.AddSlider("HP Count", 400, 1, 500, 0)
		this.keybind = entry.AddKeybind("Log Animations")
		this.keybind.OnPressed(() => this.logAnims())
		EventsSDK.on("PostDataUpdate", this.OnUpdate.bind(this))

	}
	private logAnims() {
		const me = LocalPlayer?.Hero
		if (!me) {
		  console.log("No hero entity")
		  return
		}

		if (!me.Animations || me.Animations.length === 0) {
			console.log("Animations not loaded yet"); return
		  }

		console.log(`--- All raw animations for ${me.Name} (count: ${me.Animations.length}) ---`)
		me.Animations.forEach((anim, i) => {
		  const activities = anim.activities.map(a => `${a.name}(w=${a.weight})`).join(", ")
		  console.log(`#${i}: fps=${anim.fps}, frames=${anim.frameCount}, activities=[${activities}]`)
		})
	
		const attackID = me.GetAnimationID(GameActivity.ACT_DOTA_ATTACK)
		const idleID   = me.GetAnimationID(GameActivity.ACT_DOTA_IDLE)
	
		console.log(`GetAnimationID ACT_DOTA_ATTACK => ${attackID}`)
		if (attackID !== undefined) {
		  const attackAnim = me.GetAnimation(GameActivity.ACT_DOTA_ATTACK)!
		  console.log(`  Attack anim data: fps=${attackAnim.fps}, frames=${attackAnim.frameCount}`)
		}
	
		console.log(`GetAnimationID ACT_DOTA_IDLE => ${idleID}`)
		if (idleID !== undefined) {
		  const idleAnim = me.GetAnimation(GameActivity.ACT_DOTA_IDLE)!
		  console.log(`  Idle anim data: fps=${idleAnim.fps}, frames=${idleAnim.frameCount}`)
		}
	
		if (attackID !== undefined) {
		  const pos = me.GetAttachmentPosition(
			"attach_hitloc",
			GameActivity.ACT_DOTA_ATTACK,
			0
		  )
		  console.log(`attach_hitloc at mid-attack: ${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`)
		}
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
		const isActive = arm.IsToggled

		if (hp <= threshold) {
			if (isActive) {
			  me.CastToggle(arm)
			  me.CastToggle(arm)
			} else {
			  me.CastToggle(arm)
			}
			Sleeper.Sleep(600)
		  }

	}
}
	
new MyMenu()