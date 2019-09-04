import { StackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen.js';
import AddSessionScreen from './AddSessionScreen.js';
import SelectCourtScreen from './SelectCourtScreen.js';
import AddCourtScreen from './AddCourtScreen.js';

const Navigator = StackNavigator({
    Home: { 
        screen: HomeScreen
    },
    AddSession: {
        screen: AddSessionScreen
    },
    SelectCourt: {
        screen: SelectCourtScreen
    },
    AddCourt: {
        screen: AddCourtScreen
    }
});

export default Navigator;