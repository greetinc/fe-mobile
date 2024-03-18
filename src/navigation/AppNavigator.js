import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/login/LoginScreen';
import ForgotScreen from '../screens/auth/forgotpassword/ForgotScreen';
import VerifyForgotScreen from '../screens/auth/forgotpassword/VerifyForgotScreen';
import NewPasswordScreen from '../screens/auth/forgotpassword/NewPasswordScreen';
import NameRegisterScreen from '../screens/auth/register/NameRegisterScreen';
import RegisterScreen from '../screens/auth/register/RegisterScreen';
import PictureRegisterScreen from '../screens/auth/register/PictureRegisterScreen';
import GenderRegisterScreen from '../screens/auth/register/GenderRegisterScreen';
import DetailRegisterScreen from '../screens/auth/register/DetailRegisterScreen';
import DOBScreen from '../screens/auth/register/DOBScreen';
import VerifyScreen from '../screens/auth/verify/VerifyScreen';
import VerifyForgetScreen from '../screens/auth/verify/VerifyForgetScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ProfileViewScreen from '../screens/profile/ProfileViewScreen';
import ChatScreen from '../screens/chatroom/ChatScreen';
import FriendsScreen from '../screens/friend/FriendsScreen';
import LikeScreen from '../screens/like/LikeScreen';
import SubscribeScreen from '../screens/subscribe/SubscribeScreen';
import SettingScreen from '../screens/setting/SettingScreen';
import SplashScreen from '../screens/SplashScreen';
import IntroOneScreen from '../screens/IntroOneScreen';
import IndexScreen from '../screens/IndexScreen';
import BoostScreen from '../screens/boost/BoostScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import PaymentWebView from '../screens/payment/PaymentWebView';
import CheckoutScreen from '../screens/payment/CheckoutScreen';



const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="IntroOne">
        {/* intro */}
      <Stack.Screen name="IntroOne" component={IntroOneScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
        {/* verify */}
      <Stack.Screen name="Verify" component={VerifyScreen} options={{ headerShown: false }}/>
       <Stack.Screen name="VerifyForget" component={VerifyForgetScreen} options={{ headerShown: false }}/>    
        {/* register */}
      <Stack.Screen name="PictureRegister" component={PictureRegisterScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DetailRegister" component={DetailRegisterScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DOB" component={DOBScreen} />
      <Stack.Screen name="Gender" component={GenderRegisterScreen} />    
      <Stack.Screen name="NameRegister" component={NameRegisterScreen} options={{ headerShown: false }}/> 
        {/* login */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        {/* forgot password verify */}
      <Stack.Screen name="Forgot" component={ForgotScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="VerifyForgot" component={VerifyForgotScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} options={{ headerShown: false }}/>
        {/* home */}
      <Stack.Screen name="Index" component={IndexScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileView" component={ProfileViewScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="Likes" component={LikeScreen} />
      <Stack.Screen name="Subscribe" component={SubscribeScreen} />
      <Stack.Screen name="Boost" component={BoostScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PaymentWebView" component={PaymentWebView} options={{ headerShown: false }}/>
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: false }}/>      
    </Stack.Navigator>
  );
};

export default AppNavigator;