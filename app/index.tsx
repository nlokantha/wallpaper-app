import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import { wp, hp } from "./../helpers/commen"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown } from "react-native-reanimated"
import { theme } from "./../constants/theme"
import { useRouter } from "expo-router"

export default function WelcomeScreen() {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <Image
        source={require("./../assets/images/welcome.png")}
        style={styles.bgImage}
        resizeMode="cover"
      />
      {/* Linera Gradient */}
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
        {/* content */}
        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown.duration(400).springify()}
            style={styles.title}
          >
            Pixels
          </Animated.Text>
          <Animated.Text
            style={styles.punchLine}
            entering={FadeInDown.duration(500).springify()}
          >
            Every Pixcel Tells a Story
          </Animated.Text>
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <Pressable
              onPress={() => router.push("home")}
              style={styles.startButton}
            >
              <Text style={styles.startText}>Start Explor</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: "absolute",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
  },
  title: {
    fontSize: hp(7),
    color: theme.colors.neutral(0.9),
    fontWeight: "700",
  },
  punchLine: {
    fontSize: hp(2),
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: "500",
  },
  startButton: {
    marginBottom: 50,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  startText: {
    color: theme.colors.white,
    fontSize: hp(3),
    fontWeight: "500",
    letterSpacing: 1,
  },
})
