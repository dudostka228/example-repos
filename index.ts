import { 
	EventsSDK,
	Menu,
	LocalPlayer,
	item_armlet,
	TickSleeper,
	GameActivity,
	GameRules,
	EntityManager
 } from "github.com/octarine-public/wrapper/index"

const Sleeper = new TickSleeper()

class MyMenu {
	public readonly State: Menu.Toggle
	private readonly HealthThreshold: Menu.Slider
	private readonly keybind: Menu.KeyBind
	private readonly range = 1200
	private readonly handled = new Map<number, number>()

	constructor() {
		const entry = Menu.AddEntry("Armlet Abuse")
		this.State = entry.AddToggle("Enable", true)
		this.HealthThreshold = entry.AddSlider("HP Count", 400, 1, 500, 0)
		this.keybind = entry.AddKeybind("GetAnim(ID) Log")
		this.keybind.OnPressed(() => this.logAnims())
		this.keybind = entry.AddKeybind("Raw Anim Log")
		this.keybind.OnPressed(() => this.logRawAnims())
		this.State = entry.AddToggle("Attack Anim Predictor")

		EventsSDK.on("PostDataUpdate", this.OnUpdate.bind(this))
		EventsSDK.on("PostDataUpdate", this.OnTick.bind(this))
	}

	private OnTick() {
		if (!this.State.value) return

		const me = LocalPlayer?.Hero
		if (!me || !me.IsAlive) return
	
		const enemies = EntityManager.AllEntities.filter(ent =>
		  ent.IsAlive &&
		  ent.ClassName.startsWith("CDOTA_Unit_Hero_") &&
		  ent.IsEnemy(me) &&
		  ent.Distance2D(me) <= this.range
		)
	
		for (const e of enemies) {
		  const animID  = e.GetAnimationID(GameActivity.ACT_DOTA_ATTACK)
		  if (animID === undefined) {
			this.handled.delete(e.Handle)
			continue
		  }
	
		  const prevID = this.handled.get(e.Handle)
		  if (animID === prevID) continue
		  this.handled.set(e.Handle, animID)

		  const animData = e.Animations[animID]
		  const elapsed = e.AnimationTime
		  const total = animData.frameCount / animData.fps
		  const remainingAnim = Math.max(total - elapsed, 0)
		  const speed = (e as any).BaseAttackProjectileSpeed || 0
		  const travel = speed > 0 ? e.Distance2D(me) / speed : 0
		  const arrival = remainingAnim + travel
		  console.log(
			`[PREDICT] ${e.Name} → ${me.Name}: ` +
			`анимация закончится через ${remainingAnim.toFixed(2)}с, ` +
			`${speed>0 ? `снаряд полетит ещё ${travel.toFixed(2)}с, ` : ""}` +
			`итого попадание через ${arrival.toFixed(2)}с`
		  )
		}
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
	
		const attackID = me.GetAnimationID(GameActivity.ACT_DOTA_ATTACK)
	
		console.log(`GetAnimationID ACT_DOTA_ATTACK => ${attackID}`)
		if (attackID !== undefined) {
		  const attackAnim = me.GetAnimation(GameActivity.ACT_DOTA_ATTACK)!
		  console.log(`  Attack anim data: fps=${attackAnim.fps}, frames=${attackAnim.frameCount}`)
		  console.log(attackAnim)
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

	private logRawAnims() {
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