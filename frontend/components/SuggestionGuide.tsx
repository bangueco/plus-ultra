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
        You are a {preferences.fitnessLevel}, and your BMI is {bmi}, which means you are considered {determineBMI(bmi)}.{"\n\n"}
        <Text style={{ fontWeight: "bold" }}>Recommended Sets: 2-3 per exercise</Text>{"\n"}
        <Text style={{ fontWeight: "bold" }}>Recommended Reps: 8-12 per set</Text>{"\n"}
        <Text style={{ fontWeight: "bold" }}>Rest Time: 60-90 seconds between sets</Text>{"\n\n"}
        Focus on bodyweight exercises and light strength training to build a solid foundation. Prioritize form, recover properly, and incorporate balanced nutrition to support healthy weight gain.
      </Text>
    );
  } else if (preferences.fitnessLevel === "Beginner" && bmi >= 18.5) {
    return (
      <Text style={{ fontSize: 12, textAlign: 'center' }}>
        You are a {preferences.fitnessLevel}, and your BMI is {bmi}, which means you are considered {determineBMI(bmi)}.{"\n\n"}
        <Text style={{ fontWeight: "bold" }}>Recommended Sets: 3-4 per exercise</Text>{"\n"}
        <Text style={{ fontWeight: "bold" }}>Recommended Reps: 10-15 per set</Text>{"\n"}
        <Text style={{ fontWeight: "bold" }}>Rest Time: 60-90 seconds between sets</Text>{"\n\n"}
        Start your fitness journey with compound movements like squats, push-ups, and rows. Focus on mastering form, increasing endurance, and ensuring proper rest between sets.
      </Text>
    );
  } else if (preferences.fitnessLevel === "Intermediate" && bmi < 18.5) {
    return (
      <Text style={{ fontSize: 12, textAlign: 'center' }}>
        You are an {preferences.fitnessLevel}, and your BMI is {bmi}, which means you are considered {determineBMI(bmi)}.{"\n\n"}
        <Text style={{ fontWeight: "bold" }}>Recommended Sets: 4-5 per exercise</Text>{"\n"}
        <Text style={{ fontWeight: "bold" }}>Recommended Reps: 8-10 per set</Text>{"\n"}
        <Text style={{ fontWeight: "bold" }}>Rest Time: 90-120 seconds between sets</Text>{"\n\n"}
        Prioritize progressive overload with muscle-building exercises like squats, deadlifts, presses, and pull-ups. Longer rest ensures you recover for optimal performance and strength gains.
      </Text>
    );
  } else {
    return (
      <Text style={{ fontSize: 12, textAlign: 'center' }}>
        You are a {preferences.fitnessLevel}, and your BMI is {bmi}, which means you are considered {determineBMI(bmi)}.{"\n\n"}
        <Text style={{ fontWeight: "bold" }}>Recommended Sets: 4-5 per exercise</Text>{"\n"}
        <Text style={{ fontWeight: "bold" }}>Recommended Reps: 6-12 per set</Text>{"\n"}
        <Text style={{ fontWeight: "bold" }}>Rest Time: 90-120 seconds between sets</Text>{"\n\n"}
        Push yourself with more challenging workouts, incorporating higher weights or intensity. Ensure you rest adequately between sets for recovery and sustained progress.
      </Text>
    );
  }  
}