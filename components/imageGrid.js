import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { MasonryFlashList } from "@shopify/flash-list"
import ImageCard from "./imageCard"
import { wp, hp, getColumnCount } from "./../helpers/commen"

const ImageGrid = ({ images, router }) => {
  const columns = getColumnCount()
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender={1000}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            columns={columns}
            index={index}
            router={router}
          />
        )}
        estimatedItemSize={200}
      />
    </View>
  )
}

export default ImageGrid

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
})
