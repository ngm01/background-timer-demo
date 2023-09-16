import { useEffect, useRef, useState } from "react";
import { Alert, AppState, Button, Text, TextInput, View } from "react-native";
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

export default function Timer() {


    const scheduleNotification = (time = 1) => {
        console.log(`Setting notification for ${time} seconds from now`)
        Notifications.scheduleNotificationAsync({
            content: {
              title: 'Background Timer',
              body: `Timer set ${time} seconds ago`,
            },
            trigger: {
                seconds: time
            },
          });
    }

    const cancelNotifications = () => {
        console.log("Cancelling notifications");
        Notifications.cancelAllScheduledNotificationsAsync()
    }

    const parseTime = (timeStr) => {
        let parsed = parseInt(timeStr);
        if(isNaN(parsed)) return 0;
        return parsed;
    }

    const [time, setTime] = useState('10');
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerDisplay, setTimerDisplay] = useState(10);
    
    const timeRemaining = useRef(timerDisplay);

    const appState = useRef(AppState.currentState);
    const timeAtBackground = useRef(null);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            console.debug(`AppState changed from ${appState.current} to ${nextAppState}`)
            if(appState.current.match(/^active|foreground/)  
            && nextAppState.match(/inactive|background/)) {
                timeAtBackground.current = new Date();
                scheduleNotification(timeRemaining.current)
            } else if (appState.current.match(/inactive|background/)  
            && nextAppState.match(/^active|foreground/)) {
                cancelNotifications();
                timeAtBackground.current = null;
            }
            appState.current = nextAppState;
        })

        return () => {
            subscription.remove();
          };
    }, [])

    useEffect(() => {
        setTimerDisplay(parseTime(time))
    }, [time])

    useEffect(() => {
        if(isTimerRunning) {
            if(timerDisplay > 0) {
                const timerInterval = setInterval(() => {
                    if(timeAtBackground.current) {
                        const rightNow = new Date().getTime();
                        const diff = Math.floor((rightNow - timeAtBackground.current.getTime()) / 1000)
                        setTimerDisplay(current => current - diff)
                        timeAtBackground.current === null;
                    } else {
                        setTimerDisplay(current => current - 1)
                    }
                    timeRemaining.current = timerDisplay;
                }, 1000)
                return () => clearInterval(timerInterval);
            } else {
                Alert.alert("Timer done!")
                timeAtBackground.current = null;
                timeRemaining.current = null;
                setIsTimerRunning(false);
                setTimerDisplay(parseTime(time))
            }
        } else {
            console.log("Timer stopped.")
        }
    }, [isTimerRunning, timerDisplay])


    return <View>
        <Text>Set time in seconds</Text>
        <TextInput style={{'borderWidth': 1, 'borderColor': '#111'}} onChangeText={setTime} value={time} inputMode="numeric" />
        <Text>{timerDisplay}</Text>
        <Button title={isTimerRunning ? 'Pause Timer' : 'Start Timer'} onPress={() => {setIsTimerRunning(current => !current)}} />
    </View>
}