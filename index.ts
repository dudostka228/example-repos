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
const ARMLET_MODIFIER = item_armlet.ModifierName // "modifier_item_armlet_unholy_strength"

function hasModifier(unit: any, modifierName: string): boolean {
  return EntityManager.GetEntitiesByClass(Modifier).some(mod =>
    mod.Name === modifierName && mod.Parent === unit
  )
}

class MyMenu {
	public readonly State: Menu.Toggle
	private readonly HealthThreshold: Menu.Slider

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

		const hasArmletMod = hasModifier(me, ARMLET_MODIFIER)

        if (hp <= threshold && hasArmletMod) {
            arm.CastToggle()
            Sleeper.Sleep(600)
            return
        }


        if (hp > threshold && !hasArmletMod) {
            arm.CastToggle()
            Sleeper.Sleep(600)
            return
        }
	}
}

	
new MyMenu()