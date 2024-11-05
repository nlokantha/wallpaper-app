import { Pressable, StyleSheet, Text, View } from "react-native"
import { capitalize, hp } from "../helpers/commen"
import { theme } from "../constants/theme"

export const SectionView =({title,content})=>{
  return(
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>
        {content}
      </View>
    </View>
  )
}

export const CommonFilterRow =({data,filterName,filters,setFilters })=>{

    const onSelect = (item)=>{
        setFilters({...filters,[filterName]:item})
    }


  return(
    <View style={styles.flexRowWrap}>
      {
        data && data.map((item,index)=>{
            let isActive = filters && filters[filterName] == item;
            let backgroundColor = isActive ? theme.colors.neutral(0.7):'white';
            let color = isActive? 'white':theme.colors.neutral(0.7);
            return (
                <Pressable onPress={()=>onSelect(item)} key={item} style={[styles.outlinedButton,{backgroundColor}]}>
                    <Text style={[styles.outlinedButtonText,{color}]}>{capitalize(item)}</Text>
                </Pressable>
            )
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
    sectionContainer:{
        gap:8,
    },
    sectionTitle:{
        fontSize:hp(2.4),
        fontWeight:theme.fontWeights.medium,
        color:theme.colors.neutral(0.8),
    },
    flexRowWrap:{
        gap:8,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    outlinedButton:{
        padding:8,
        paddingHorizontal:14,
        borderWidth:1,
        borderColor:theme.colors.greyBG,
        borderRadius:theme.radius.xs,
        borderCurve:'continuous'

    }
})