import { StyleSheet, Text, View } from "react-native"
import React, { useMemo } from "react"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { BlurView } from 'expo-blur';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { capitalize, hp, wp } from "../helpers/commen"
import { theme } from "../constants/theme";
import { CommonFilterRow, SectionView } from "./filterViews";
import { data } from "../constants/data";

const FiltersModal = ({ 
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters
 }) => {
  const snapPoints = useMemo(() => ["75%"], [])
  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={CustomBackrop}
      // onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {
            Object.keys(sections).map((sectionName,index)=>{
              let sectionView = sections[sectionName];
              let sectionData = data.filters[sectionName]
              let title = capitalize(sectionName);
              return(
                <View key={sectionName}>
                  <SectionView title={sectionName} content={sectionView({
                    data:sectionData,
                    filters,
                    setFilters,
                    filterName:sectionName
                    })}/>

                  </View>
              )
            })
          }

        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const sections = {
  "order":(prop)=><CommonFilterRow {...prop}/>,
  "orientation":(prop)=><CommonFilterRow {...prop}/>,
  "type":(prop)=><CommonFilterRow {...prop}/>,
  "colors":(prop)=><CommonFilterRow {...prop}/>
}






const CustomBackrop =({animatedIndex,style})=>{
  const containerAnimatedStyle = useAnimatedStyle(()=>{
    let opacity = interpolate(
      animatedIndex.value,
      [-1,0],
      [0,1],
      Extrapolation.CLAMP
    )
    return {
      opacity
    }
  })


  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle
  ]
  return (
    <Animated.View style={containerStyle}>
      {/* blur view */}
      <BlurView
        style={StyleSheet.absoluteFill}
        tint="dark"
        intensity={25}/>
       
    </Animated.View>
  )
}

export default FiltersModal

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay:{
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  content:{
    width:'100%',
    gap:15,
    paddingVertical:10,
    paddingHorizontal:20
  },
  filterText:{
    fontSize:hp(4),
    fontWeight:theme.fontWeights.semibold,
    color:theme.colors.neutral(0.8),
    marginBottom:5
  }
})
