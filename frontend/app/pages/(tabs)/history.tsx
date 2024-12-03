import useSystemTheme from "@/hooks/useSystemTheme"
import { useHistoryStore } from "@/store/useHistoryStore"
import { useEffect } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { Icon } from "react-native-paper"

interface ExerciseSummary {
  exercise_name: string;
  setsCount: number;
  reps: number;
}

interface ExerciseMax extends ExerciseSummary {
  maxWeight: number
}

const History = () => {

  const systemTheme = useSystemTheme()
  const { history, historyExercise, fetchHistory, fetchHistoryExercise } = useHistoryStore();

  useEffect(() => {
    async function getAllHistory() {
      await fetchHistory()
      await fetchHistoryExercise()
    }

    getAllHistory()
  },[])

  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5, marginBottom: 20}}>
        <Text style={{color: systemTheme.colors.text, fontSize: 30, textAlign: 'center'}}>History</Text>
      </View>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.historyContainer} showsVerticalScrollIndicator={false} scrollEnabled={history.length > 0}>
          <View style={{justifyContent: 'center', alignItems: 'center', padding: 10, gap: 10, flexDirection: 'column-reverse'}}>
            {
              history && history.map((item) => (
                <View key={item.history_id} style={[styles.historyItem, {backgroundColor: systemTheme.colors.card, position: 'relative', borderColor: systemTheme.colors.border, borderWidth: 2}]}>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: systemTheme.colors.text, fontSize: 25}}>{item.template_name}</Text>
                    <View
                      style={{flexDirection: 'row', gap: 10}}
                    >
                      <View
                        style={{flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center'}}
                      >
                        <Icon
                          source="calendar-range"
                          color={systemTheme.colors.text}
                          size={20}
                        />
                        <Text style={{color: systemTheme.colors.text}}>{item.date}</Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center'}}
                      >
                        <Icon
                          source="clock-time-nine"
                          color={systemTheme.colors.text}
                          size={20}
                        />
                        <Text style={{color: systemTheme.colors.text}}>{item.elapsed_time}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.historyResultsContainer}>
                    <View style={{width: 120}}>
                      <Text style={{color: systemTheme.colors.primary, fontSize: 18}}>Exercises</Text>
                      {
                        historyExercise
                        .filter(itemExe => itemExe.history_id === item.history_id) // Filter by the history_id
                        .map(exe => exe.exercise_name) // Extract the exercise_name values
                        .filter((value, index, self) => self.indexOf(value) === index) // Filter out duplicates
                        .map(uniqueExerciseName => (
                          <Text style={{color: systemTheme.colors.text}} numberOfLines={1} key={uniqueExerciseName}>{uniqueExerciseName}</Text>
                        ))
                      }
                    </View>
                    <View style={{marginLeft: 20}}>
                      <Text style={{color: systemTheme.colors.primary, fontSize: 18}}>Sets</Text>
                      {
                        historyExercise
                        .filter(itemExe => itemExe.history_id === item.history_id) // Filter by history_id
                        .reduce<ExerciseSummary[]>((acc, exe) => {
                          // Find if the exercise is already in the accumulator
                          const existing = acc.find(item => item.exercise_name === exe.exercise_name);
                          if (existing) {
                            // Increment the set count and update reps if necessary (get max reps)
                            existing.setsCount += 1;
                            existing.reps = Math.max(existing.reps, exe.reps); // Keep the maximum reps
                          } else {
                            // If it's the first occurrence, add the exercise to the accumulator
                            acc.push({
                              exercise_name: exe.exercise_name,
                              setsCount: 1,
                              reps: exe.reps
                            });
                          }
                          return acc;
                        }, []) // Initialize accumulator as an empty array
                        .map(exe => (
                          <Text style={{color: systemTheme.colors.text}} key={exe.exercise_name}>
                            {exe.setsCount} x {exe.reps} {/* Display sets count and max reps */}
                          </Text>
                        ))
                      }
                    </View>
                    <View style={{marginLeft: 30}}>
                      <Text style={{color: systemTheme.colors.primary, fontSize: 18}}>Weight</Text>
                      {
                        historyExercise
                          .filter(itemExe => itemExe.history_id === item.history_id) // Filter by history_id
                          .reduce<ExerciseMax[]>((acc, exe) => {
                            // Find if the exercise is already in the accumulator
                            const existing = acc.find(item => item.exercise_name === exe.exercise_name);
                            if (existing) {
                              // Update maxWeight if necessary
                              existing.maxWeight = Math.max(existing.maxWeight, exe.weight); // Keep the maximum weight
                            } else {
                              // If it's the first occurrence, add the exercise to the accumulator
                              acc.push({
                                exercise_name: exe.exercise_name,
                                setsCount: 1,
                                reps: exe.reps,
                                maxWeight: exe.weight
                              });
                            }
                            return acc;
                          }, []) // Initialize accumulator as an empty array
                          .map(exe => (
                            <Text style={{color: systemTheme.colors.text}} key={exe.exercise_name}>
                              {exe.maxWeight} {/* Display max weight for each exercise */}
                            </Text>
                          ))
                      }
                    </View>
                  </View>
                  <View
                    style={{flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 10, right: 10}}
                  >
                    <Icon
                      source="fire-alert"
                      color="orange"
                      size={20}
                    />
                    <Text style={{color: "orange"}}>Calories Burned:</Text>
                    <Text style={{color: "orange"}}>{Math.round(item.calories_burned)}</Text>
                  </View>
                </View>
              ))
            }
            {
              history && history.length <= 0 ? <Text style={{color: systemTheme.colors.text, fontSize: 20}}>No workout history found!</Text> : null
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%'
  },
  historyContainer: {
    flexGrow: 1
  },
  historyItem: {
    width: '95%',
    flex: 1,
    padding: 15,
    borderRadius: 15,
    gap: 40
  },
  historyItemDate: {
    color: 'white', 
    fontSize: 15,
  },
  historyResultsContainer: {
    flexDirection: 'row',
    paddingBottom: 100
  }
})

export default History