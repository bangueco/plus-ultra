type EquipmentDescriptionProps = {
  equipment_name: string
}

export default function EquipmentDescription({ equipment_name }: EquipmentDescriptionProps) {
  const getDescription = (name: string): string => {
    switch (name.toLowerCase()) {
      case 'barbell':
        return 'A barbell is a long bar used to perform strength training exercises like squats, deadlifts, and bench presses. It allows you to lift heavier weights.';
      case 'cable machine':
        return 'A cable machine uses adjustable pulleys and cables to provide constant tension during resistance exercises. Ideal for isolation and compound movements.';
      case 'dumbbell':
        return 'A dumbbell is a short bar with weights on either end. It is versatile and allows for a wide range of strength and conditioning exercises.';
      case 'lat pulldown machine':
        return 'The lat pulldown machine targets the latissimus dorsi muscles, mimicking the motion of a pull-up but with adjustable resistance.';
      case 'multi-flight machine':
        return 'A multi-flight machine combines multiple stations into one, enabling a full-body workout using cables, presses, and pulleys.';
      case 'pec deck machine':
        return 'The pec deck machine isolates the chest muscles (pectorals), allowing you to perform chest flyes with controlled resistance.';
      case 'smith machine':
        return 'A Smith machine is a guided barbell system that stabilizes the weight, providing support for exercises like squats, presses, and lunges.';
      default:
        return 'Equipment not recognized. Please select valid gym equipment.';
    }
  };

  return (
    <div>
      <h3>{equipment_name}</h3>
      <p>{getDescription(equipment_name)}</p>
    </div>
  );
}