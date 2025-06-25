import { 
	EventsSDK,
	Menu,
	Modifier,
	LocalPlayer,
	item_armlet,
	TickSleeper,
	EntityManager,
	modifier_item_armlet_unholy_strength
 } from "github.com/octarine-public/wrapper/index"

const Sleeper = new TickSleeper()

const mods = EntityManager.GetEntitiesByClass(modifier_item_armlet_unholy_strength);
const hasArmletMod = mods.some(mod => mod.Parent === LocalPlayer);

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