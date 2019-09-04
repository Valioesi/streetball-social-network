import { TabNavigator } from 'react-navigation';
import FriendScreen from './FriendScreen.js';
import SessionScreen from './SessionScreen.js';
import CourtScreen from './CourtScreen.js'; 

const HomeScreen = TabNavigator({
    Sessions: { 
        screen: SessionScreen 
    },
    Users: { 
        screen: FriendScreen 
    },
    Courts: {
        screen: CourtScreen
    } 
});

HomeScreen.navigationOptions = {
    title: 'Home'
}
export default HomeScreen;