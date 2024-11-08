import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
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
import { useRouter } from "expo-router"

var page = 1

const HomeScreen = () => {
  const { top } = useSafeAreaInsets()
  const paddingTop = top > 0 ? top + 10 : 30
  const [search, setSearch] = useState("")
  const searchInputRef = useRef()
  const [activeCategory, setActiveCategory] = useState(null)
  const [images, setImages] = useState([])
  const modalRef = useRef(null)
  const scrollRef = useRef(null)
  const [filters, setFilters] = useState(null)
  const router = useRouter()
  const [isEndReached,setIsEndReached] = useState(false);

  useEffect(() => {
    fetchImages()
  }, [])

  const openFiltersModal = () => {
    modalRef?.current?.present()
  }
  const closeFiltersModal = () => {
    modalRef?.current?.close()
  }

  const applyFilters = () => {
    if (filters) {
      page: 1
      setImages([])
      let params = {
        page,
        ...filters,
      }
      if (activeCategory) params.category = activeCategory
      if (search) params.q = search
      fetchImages(params, false)
    }
    closeFiltersModal()
  }
  const resetFilters = () => {
    if (filters) {
      page: 1
      setFilters(null)
      setImages([])
      let params = {
        page,
      }
      if (activeCategory) params.category = activeCategory
      if (search) params.q = search
      fetchImages(params, false)
    }
    closeFiltersModal()
  }
  const clearThisFilter = (filterName) => {
    let filterz = { ...filters }
    delete filterz[filterName]
    setFilters({ ...filterz })
    page: 1
    setImages([])
    let params = {
      page,
      ...filterz,
    }
    if (activeCategory) params.category = activeCategory
    if (search) params.q = search
    fetchImages(params, false)
  }

  const fetchImages = async (params = { page: 1 }, append = true) => {
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
      ...filters,
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
      fetchImages({ page, q: text, ...filters }, false)
    }
    if (text == "") {
      // reset result
      page = 1
      setImages([])
      setActiveCategory(null) // clear category when searching
      searchInputRef?.current?.clear()
      fetchImages({ page, q: text, ...filters }, false)
    }
  }
  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if(scrollOffset>= bottomPosition-1){
      if(!isEndReached){
        setIsEndReached(true)
        console.log('reached the bottom of scrollview');
        //fetch more image
        ++page;
        let params = {
          page,
          ...filters
        }
        if(activeCategory) params.category = activeCategory;
        if(search) params.q = search;
        fetchImages(params);

      }
      
    }else if(isEndReached){
      setIsEndReached(false);
    }
  }
  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({ y: 0, animated: true })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])

  // console.log("filters ", filters)

  const clearSearch = () => {
    setSearch("")
    searchInputRef?.current?.clear()
  }

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
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
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
        showsVerticalScrollIndicator={false}
      >
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

        {/* active filters */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    <Text style={styles.filterItemText}>{filters[key]}</Text>
                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.6)}
                      />
                    </Pressable>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        )}

        {/* images masongry grid */}
        <View>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>
        {/* loading */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      </ScrollView>
      {/* filters model */}
      <FiltersModal
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
        modalRef={modalRef}
      />
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
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    padding: 11,
    flexDirection: "row",
    backgroundColor: theme.colors.greyBG,
    gap: 10,
    paddingHorizontal: 10,
    borderRadius: theme.radius.xs,
    alignItems: "center",
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    padding: 4,
    borderRadius: 7,
    backgroundColor: theme.colors.neutral(0.2),
  },
})
