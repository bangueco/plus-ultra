import CustomPressable from "@/components/custom/CustomPressable"
import { templatesDatabase } from "@/database"
import useSystemTheme from "@/hooks/useSystemTheme"
import { TemplatesType } from "@/types/templates"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"


const Workout = () => {
  const systemTheme = useSystemTheme()
  const [workoutTemplates, setWorkoutTemplates] = useState<Array<TemplatesType>>([])

  const fetchTemplates = async () => {
    try {
      const templates = await templatesDatabase.db.getAllAsync<TemplatesType>('SELECT * FROM templates;')
      console.log('Templates fetched successfully')
      return setWorkoutTemplates(templates)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <View>
          <Text style={{color: systemTheme.colors.text, fontSize: 20}}>Start Workout</Text>
        </View>
        <View style={{marginTop: 30, gap: 10, alignItems: 'center'}}>
          <Text style={{color: systemTheme.colors.primary, fontSize: 17}}>Quick Start</Text>
          <CustomPressable
            buttonStyle={{backgroundColor: systemTheme.colors.primary, borderRadius: 5, width: '90%'}}
            textStyle={{fontSize: 20, color: 'white'}}
            text="Start an empty workout"
          />
        </View>
        <View style={styles.templateContainer}>
          <View style={{gap: 5}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}>My templates</Text>
            <View style={styles.templates}>
              <CustomPressable
                text="+"
                buttonStyle={{
                  backgroundColor: 'transparent', 
                  borderColor: systemTheme.colors.border, 
                  borderWidth: 1,
                  borderRadius: 5,
                  width: 110,
                  height: 100,
                }}
                textStyle={{
                  fontSize: 50,
                  color: systemTheme.colors.text
                }}
              />
            </View>
          </View>
          <View style={{gap: 5}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}>Example templates</Text>
            <View style={styles.templates}>
              {
                workoutTemplates && workoutTemplates.map((template) => (
                  <CustomPressable
                    onPress={() => console.log(template.template_id)}
                    key={template.template_id}
                    text={template.template_name}
                    buttonStyle={{
                      backgroundColor: 'transparent', 
                      borderColor: systemTheme.colors.border, 
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 110,
                      height: 100,
                      flex: 1
                    }}
                    textStyle={{
                      fontSize: 14,
                      color: systemTheme.colors.text
                    }}
                  />
                ))
              }
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%'
  },
  templateContainer: {
    marginTop: 20,
    gap: 5
  },
  templates: {
    flexDirection: 'row', 
    gap: 10, 
    flexWrap: 'wrap'
  }
})

export default Workout