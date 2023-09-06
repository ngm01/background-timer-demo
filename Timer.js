import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";


export default function Timer() {

    const [time, setTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerDisplay, setTimerDisplay] = useState(0);

    useEffect(() => {
        setTimerDisplay(time.toString())
    }, [time])

    useEffect(() => {
        if(isTimerRunning) {
            if(timerDisplay > 0) {
                console.log("Counting down...")
                const timerInterval = setInterval(() => {
                        setTimerDisplay(current => current - 1)
                }, 1000)
                return () => clearInterval(timerInterval);
            } else {
                setIsTimerRunning(false);
                setTimerDisplay(time)
            }
        } else {
            console.log("Pausing...")
        }
    }, [isTimerRunning, timerDisplay])


    return <View>
        <Text>Set time in seconds</Text>
        <TextInput style={{'borderWidth': 1, 'borderColor': '#111'}} onChangeText={setTime} value={time} inputMode="numeric" />
        <Text>{timerDisplay}</Text>
        <Button title={isTimerRunning ? 'Pause Timer' : 'Start Timer'} onPress={() => {setIsTimerRunning(current => !current)}} />
    </View>
}