import { CardEquipaments } from "./card-equipaments";

export function Equipment() {
  return (
    <div className="flex flex-col gap-4">

    <h1>Equipamentos</h1>

    <div className="grid grid-cols-4 gap-4">
     <CardEquipaments/>
    </div>
    </div>
  )
}