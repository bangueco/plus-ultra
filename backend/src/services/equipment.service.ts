type LensApiResult = {
  visual_matches: Array<{title: string, position: number}>
}

type EquipmentCountProps = {
  equipment_name: string,
  count: number
}

const identifyEquipment = (response: LensApiResult) => {

  const equipments = [
    'dumbbell',
    'lat pulldown',
    'barbell'
  ]

  let equipmentCount: Array<EquipmentCountProps> = []
  
  equipments.forEach(equipment => {
    
    equipmentCount.push({equipment_name: equipment, count: 0})

    response.visual_matches.forEach(result => {
      if (result.title.toLowerCase().includes(equipment)) {
        const index = equipmentCount.findIndex(item => item.equipment_name === equipment)
        equipmentCount[index].count += 1
      }
    })
  })

  return equipmentCount.reduce((max, current) => (max.count > current.count) ? max : current, equipmentCount[0])
}

export default {
  identifyEquipment
}