import { StyleSheet, Text, View } from "react-native"
import React, { useMemo } from "react"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"

const FiltersModal = ({ modalRef }) => {
  const snapPoints = useMemo(() => ["75%"], [])
  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      // onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default FiltersModal

const styles = StyleSheet.create({})
