import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Hello from '../screens/hello';
import Home from '../screens/home';
import Welcome from '../screens/welcome';
import Restaurant from '../screens/restaurant';
import Booking from '../screens/booking';
import Rating from '../screens/rating';
import Login from '../screens/login';
import Tables from '../screens/tables';
import Invoice from '../screens/Invoice';
import Profile from '../screens/profile';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Hello"
        component={Hello}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Tables"
        component={Tables}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Invoice"
        component={Invoice}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Restaurant"
        component={Restaurant}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Booking"
        component={Booking}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Rating"
        component={Rating}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default MyStack;
