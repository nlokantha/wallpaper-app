import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { MasonryFlashList } from "@shopify/flash-list"
import ImageCard from "./imageCard"

const ImageGrid = ({ images }) => {
  return (
    <View>
      <MasonryFlashList
        data={images}
        numColumns={2}
        renderItem={({ item }) => <ImageCard item={item} />}
        estimatedItemSize={200}
      />
    </View>
  )
}

export default ImageGrid

const styles = StyleSheet.create({})
