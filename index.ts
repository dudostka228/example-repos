import { 
	EventsSDK,
	Menu,
	LocalPlayer,
	EntityManager,
	item_armlet,
	TickSleeper,
	GameState
 } from "github.com/octarine-public/wrapper/index"



 const Sleeper = new TickSleeper()

 const Entry = Menu.AddEntry("Armlet")
 const ArmletNode = Entry.AddNode("Armlet Abuse")
 ArmletNode.SortNodes = false
 
 const ArmletState = ArmletNode.AddToggle("State", true)
 const HPCount    = ArmletNode.AddSlider("HP Count", 400, 1, 500, 0)
 
 EventsSDK.on("PostDataUpdate", delta => {
   const me = LocalPlayer?.Hero
   if (
	 delta === 0 ||
	 !ArmletState.value ||
	 !me ||
	 !me.IsAlive ||
	 Sleeper.Sleeping
   ) {
	 return
   }
 
   const urnMod = me.Modifiers.find(
	 m => m.Name === "modifier_item_urn_of_shadows_debuff"
   )
   if (!urnMod || urnMod.RemainingTime * 1000 > HPCount.value) {
	 return
   }
 
   const armlet = EntityManager
	 .GetEntitiesByClass(item_armlet)
	 .find(a => a.Owner === me)
   if (!armlet || !armlet.CanBeCasted()) {
	 return
   }
 
   const lag     = (GameState.InputLag + GameState.IOLag) * 1000
   const remMs   = (urnMod.RemainingTime % 1) * 1000 || 1000
   const delayMs = Math.max(remMs - lag - 50, 0)
 
   setTimeout(() => {
	 me.CastToggle(armlet)
	 me.CastToggle(armlet)
	 Sleeper.Sleep(100)
   }, delayMs)
 })
 
 EventsSDK.on("GameEnded", () => {
   Sleeper.ResetTimer()
 })