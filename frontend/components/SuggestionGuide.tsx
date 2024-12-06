import { useUserStore } from "@/store/useUserStore"
import { useEffect, useState } from "react";
import { Text } from "react-native-paper";

export default function SuggestionGuide() {

  const { preferences } = useUserStore()

  const [bmi, setBmi] = useState<number>(0)

  function calculateBMI(weight: number, height: number) {
    if (height <= 0) {
      return 'Height must be greater than zero';
    }
  
    // Convert height from cm to meters
    const heightInMeters = height / 100;
  
    const bmiResult = weight / (heightInMeters * heightInMeters);
  
    setBmi(Number(bmiResult.toFixed(2)));
  }

  function determineBMI(bmi: number) {
    if (bmi <= 16.4) {
      return <Text>Severe thinness</Text>;
    } else if (bmi <= 16.9) {
      return <Text>Moderate thinness</Text>;
    } else if (bmi <= 18.4) {
      return <Text>Mild thinness</Text>;
    } else if (bmi <= 24.9) {
      return <Text>Normal weight</Text>;
    } else if (bmi <= 29.9) {
      return <Text>Overweight</Text>;
    } else if (bmi <= 34.9) {
      return <Text>Obesity Class I</Text>;
    } else if (bmi <= 39.9) {
      return <Text>Obesity Class II</Text>;
    } else {
      return <Text>Obesity Class III (Severe obesity)</Text>;
    }
  }

  useEffect(() => {
    calculateBMI(preferences.weight, preferences.height)
  }, [preferences])

  if (preferences.fitnessLevel === "Beginner" && bmi < 18.5) {
    return (
      <Text style={{ fontSize: 12, textAlign: 'center' }}>
        You are a {preferences.fitnessLevel}, and your BMI is {bmi}, which means you are considered {determineBMI(bmi)}. 
        It is recommended to take a maximum of 3 sets per exercise and focus on building strength gradually. Be sure to incorporate balanced nutrition into your routine to help improve your overall health.
      </Text>
    );
  } else if (preferences.fitnessLevel === "Beginner" && bmi >= 18.5) {
    return (
      <Text style={{ fontSize: 12, textAlign: 'center' }}>
        You are a {preferences.fitnessLevel}, and your BMI is {bmi}, which means you are considered {determineBMI(bmi)}. 
        It's a great time to start your fitness journey! Focus on mastering form and gradually increasing intensity. Aim for a balanced workout routine with 3-4 sets per exercise.
      </Text>
    );
  } else if (preferences.fitnessLevel === "Intermediate" && bmi < 18.5) {
    return (
      <Text style={{ fontSize: 12, textAlign: 'center' }}>
        You are an {preferences.fitnessLevel}, and your BMI is {bmi}, which means you are considered {determineBMI(bmi)}. 
        At this stage, focus on improving your strength and muscle mass, with more sets per exercise (up to 4-5). 
        Ensure that your nutrition supports muscle growth and recovery.
      </Text>
    );
  } else {
    return (
      <Text style={{ fontSize: 12, textAlign: 'center' }}>
        You are a {preferences.fitnessLevel}, and your BMI is {bmi}, which means you are considered {determineBMI(bmi)}. 
        Keep pushing yourself with more challenging workouts and aim for 4-5 sets per exercise. Be sure to fuel your body with the proper nutrients to support your active lifestyle.
      </Text>
    );
  }
}