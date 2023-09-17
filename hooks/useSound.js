import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export const useSound = (path) => {

    const [soundToPlay, setSound] = useState(null);

    const playSound = async () => {
        try {
            const playTime = new Date().toLocaleTimeString();
            console.log("playing sound:", playTime)
            const { sound } = await Audio.Sound.createAsync(path)
            setSound(sound);
            await sound.playAsync();
        } catch (e) {
            console.log("Error playing sound:", e);
        }
    }
    
    useEffect(() => {
        console.log("useSound useEffect firing...")
        return soundToPlay ?
         async () => {
            const unloadTime = new Date().toLocaleTimeString();
            console.debug("UNLOADING SOUND", unloadTime)
            await soundToPlay.unloadAsync();
            setSound(null);
        } : undefined
    }, [soundToPlay])

    return [playSound]

}