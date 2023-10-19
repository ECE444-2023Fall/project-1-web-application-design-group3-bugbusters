import { NavigationContainer } from "@react-navigation/native";
import { store } from "./src/store/Store";
import { Provider } from "react-redux";
import MainStack from "./src/navigation/StackNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
}
