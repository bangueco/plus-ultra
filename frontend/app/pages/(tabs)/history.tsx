import useSystemTheme from "@/hooks/useSystemTheme"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"

const History = () => {

  const systemTheme = useSystemTheme()
  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5, marginBottom: 20}}>
        <Text style={{color: systemTheme.colors.text, fontSize: 20}}>History</Text>
      </View>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
          <View style={{justifyContent: 'center', alignItems: 'center', padding: 10, gap: 10}}>
            <View style={[styles.historyItem, {backgroundColor: systemTheme.colors.primary}]}>
              <View>
                <Text style={styles.historyItemTitle}>PUSH DAY</Text>
                <Text style={styles.historyItemDate}>Thursday, 30 July 2024</Text>
              </View>
              <View style={styles.historyResultsContainer}>
                <View style={{width: 120}}>
                  <Text style={{color: 'white', fontSize: 18}}>Exercise</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Bench Press (Flat Bench)</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Incline Bench Press (Incline Bench)</Text>
                </View>
                <View style={{marginLeft: 20}}>
                  <Text style={{color: 'white', fontSize: 18}}>Best Set</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                </View>
              </View>
            </View>
            <View style={[styles.historyItem, {backgroundColor: systemTheme.colors.primary}]}>
              <View>
                <Text style={styles.historyItemTitle}>PUSH DAY</Text>
                <Text style={styles.historyItemDate}>Thursday, 30 July 2024</Text>
              </View>
              <View style={styles.historyResultsContainer}>
                <View style={{width: 120}}>
                  <Text style={{color: 'white', fontSize: 18}}>Exercise</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Bench Press (Flat Bench)</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Incline Bench Press (Incline Bench)</Text>
                </View>
                <View style={{marginLeft: 20}}>
                  <Text style={{color: 'white', fontSize: 18}}>Best Set</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                </View>
              </View>
            </View>
            <View style={[styles.historyItem, {backgroundColor: systemTheme.colors.primary}]}>
              <View>
                <Text style={styles.historyItemTitle}>PUSH DAY</Text>
                <Text style={styles.historyItemDate}>Thursday, 30 July 2024</Text>
              </View>
              <View style={styles.historyResultsContainer}>
                <View style={{width: 120}}>
                  <Text style={{color: 'white', fontSize: 18}}>Exercise</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Bench Press (Flat Bench)</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Incline Bench Press (Incline Bench)</Text>
                </View>
                <View style={{marginLeft: 20}}>
                  <Text style={{color: 'white', fontSize: 18}}>Best Set</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                </View>
              </View>
            </View>
            <View style={[styles.historyItem, {backgroundColor: systemTheme.colors.primary}]}>
              <View>
                <Text style={styles.historyItemTitle}>PUSH DAY</Text>
                <Text style={styles.historyItemDate}>Thursday, 30 July 2024</Text>
              </View>
              <View style={styles.historyResultsContainer}>
                <View style={{width: 120}}>
                  <Text style={{color: 'white', fontSize: 18}}>Exercise</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Bench Press (Flat Bench)</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Incline Bench Press (Incline Bench)</Text>
                </View>
                <View style={{marginLeft: 20}}>
                  <Text style={{color: 'white', fontSize: 18}}>Best Set</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                </View>
              </View>
            </View>
            <View style={[styles.historyItem, {backgroundColor: systemTheme.colors.primary}]}>
              <View>
                <Text style={styles.historyItemTitle}>PUSH DAY</Text>
                <Text style={styles.historyItemDate}>Thursday, 30 July 2024</Text>
              </View>
              <View style={styles.historyResultsContainer}>
                <View style={{width: 120}}>
                  <Text style={{color: 'white', fontSize: 18}}>Exercise</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Bench Press (Flat Bench)</Text>
                  <Text style={{color: 'white'}} numberOfLines={1}>3x Incline Bench Press (Incline Bench)</Text>
                </View>
                <View style={{marginLeft: 20}}>
                  <Text style={{color: 'white', fontSize: 18}}>Best Set</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                  <Text style={{color: 'white'}}>40lb x 12</Text>
                </View>
              </View>
            </View>
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
    padding: 15,
    borderRadius: 10,
    gap: 25,
  },
  historyItemTitle: {
    color: 'white', 
    fontSize: 40, 
    fontWeight: 'bold'
  },
  historyItemDate: {
    color: 'white', 
    fontSize: 15,
  },
  historyResultsContainer: {
    flexDirection: 'row',
  }
})

export default History