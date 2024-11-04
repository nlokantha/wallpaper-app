import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Pressable } from "react-native"
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons"
import { theme } from "./../../constants/theme"
import { wp, hp } from "./../../helpers/commen"
import Categories from "../../components/categories"
import { apiCall } from "../../api"
import ImageGrid from "../../components/imageGrid"
import { debounce } from "lodash"
import FiltersModal from "../../components/filtersModal"

var page = 1

const HomeScreen = () => {
  const { top } = useSafeAreaInsets()
  const paddingTop = top > 0 ? top + 10 : 30
  const [search, setSearch] = useState("")
  const searchInputRef = useRef()
  const [activeCategory, setActiveCategory] = useState(null)
  const [images, setImages] = useState([])
  const modalRef = useRef(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const openFiltersModal = () => {
    modalRef?.current?.present()
  }
  const closeFiltersModal = () => {
    modalRef?.current?.close()
  }

  const fetchImages = async (params = { page: 1 }, append = false) => {
    console.log("params: ", params, append)

    let res = await apiCall(params)
    if (res.success && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res.data.hits])
      } else {
        setImages([...res.data.hits])
      }
    }
  }

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat)
    clearSearch()
    setImages([])
    page = 1
    let params = {
      page,
    }
    if (cat) params.category = cat
    fetchImages(params, false)
  }

  const handleSearch = (text) => {
    console.log("search for ", text)
    setSearch(text)
    if (text.length > 2) {
      // search for this text
      page = 1
      setImages([])
      setActiveCategory(null) // clear category when searching
      fetchImages({ page, q: text }, false)
    }
    if (text == "") {
      // reset result
      page = 1
      setImages([])
      setActiveCategory(null) // clear category when searching
      searchInputRef?.current?.clear()
      fetchImages({ page, q: text }, false)
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])

  const clearSearch = () => {
    setSearch("")
    searchInputRef?.current?.clear()
  }

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ gap: 15 }}>
        {/* search bar... */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            // value={search}
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
            style={styles.searchInput}
          />
          {search && (
            <Pressable
              onPress={() => handleSearch("")}
              style={styles.closeIcon}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>
        {/* images masongry grid */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
      </ScrollView>
      {/* filters model */}
      <FiltersModal modalRef={modalRef} />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
    borderWidth: 1,
    borderColor: theme.colors.greyBG,
    backgroundColor: theme.colors.white,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
})
