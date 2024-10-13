import useSystemTheme from "@/hooks/useSystemTheme"
import historyService from "@/services/history.service"
import { useEffect, useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { Icon } from "react-native-paper"

type HistoryExercise = {
  history_id: number,
  template_name: string,
  elapsed_time: string,
  calories_burned: number,
  date: string
}

const History = () => {

  const systemTheme = useSystemTheme()

  const [history, setHistory] = useState<Array<HistoryExercise>>([])

  useEffect(() => {
    historyService.getAllHistory().then((data) => setHistory(data)).catch(console.error)
  }, [])

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
                      <Text style={{color: systemTheme.colors.text, fontSize: 18}}>Exercises</Text>
                    </View>
                    <View style={{marginLeft: 20}}>
                      <Text style={{color: systemTheme.colors.text, fontSize: 18}}>Best Set</Text>
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
                    <Text style={{color: "orange"}}>{item.calories_burned}200</Text>
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