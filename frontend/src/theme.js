import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    navy: {
      50:  "#E8EDF5",
      100: "#C5D0E6",
      200: "#A2B3D7",
      300: "#7F96C8",
      400: "#5C79B9",
      500: "#2A4080",
      600: "#1A2B4B",
      700: "#142138",
      800: "#0D1625",
      900: "#060B12",
    },
    brand: {
      50:  "#FFF0E6",
      100: "#FFDAB8",
      200: "#FFC38A",
      300: "#FFAC5C",
      400: "#FF8A00",
      500: "#FF6200",
      600: "#CC4E00",
      700: "#993B00",
      800: "#662800",
      900: "#331400",
    },
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body:    "Inter, system-ui, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        letterSpacing: "0.04em",
        borderRadius: "8px",
      },
    },
    Input: {
      defaultProps: { focusBorderColor: "navy.600" },
    },
    Select: {
      defaultProps: { focusBorderColor: "navy.600" },
    },
  },
});

export default theme;
