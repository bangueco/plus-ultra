import { Pressable, StyleSheet, Text } from "react-native"
import { AntDesign } from '@expo/vector-icons';

type BtnProps = {
  text: string;
  buttonStyle?: object;
  textStyle?: object;
  iconName?: keyof typeof AntDesign.glyphMap;
  iconSize?: number;
  iconColor?: string;
};

const CustomBtn = ({ text, buttonStyle, textStyle, iconName, iconSize = 24, iconColor = '#fff' }: BtnProps) => {
  return (
    <Pressable style={[styles.defaultButtonStyle, buttonStyle]}>
      {iconName && (
          <AntDesign
            name={iconName} 
            size={iconSize} 
            color={iconColor} 
          />
        )}
      <Text style={[styles.defaultTextStyle, textStyle]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  defaultButtonStyle: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 10,
    gap: 10
  },
  defaultTextStyle: {
    fontSize: 10,
    textAlign: 'center',  
  }
})

export default CustomBtn