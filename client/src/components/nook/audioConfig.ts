export type WeatherMode = 'normal' | 'rain';

// Audio files are named 0.mp3 through 23.mp3 (24-hour format)
// 0 = midnight, 12 = noon, 23 = 11pm

import normal0 from '../../assets/ac/normal/0.mp3';
import normal1 from '../../assets/ac/normal/1.mp3';
import normal2 from '../../assets/ac/normal/2.mp3';
import normal3 from '../../assets/ac/normal/3.mp3';
import normal4 from '../../assets/ac/normal/4.mp3';
import normal5 from '../../assets/ac/normal/5.mp3';
import normal6 from '../../assets/ac/normal/6.mp3';
import normal7 from '../../assets/ac/normal/7.mp3';
import normal8 from '../../assets/ac/normal/8.mp3';
import normal9 from '../../assets/ac/normal/9.mp3';
import normal10 from '../../assets/ac/normal/10.mp3';
import normal11 from '../../assets/ac/normal/11.mp3';
import normal12 from '../../assets/ac/normal/12.mp3';
import normal13 from '../../assets/ac/normal/13.mp3';
import normal14 from '../../assets/ac/normal/14.mp3';
import normal15 from '../../assets/ac/normal/15.mp3';
import normal16 from '../../assets/ac/normal/16.mp3';
import normal17 from '../../assets/ac/normal/17.mp3';
import normal18 from '../../assets/ac/normal/18.mp3';
import normal19 from '../../assets/ac/normal/19.mp3';
import normal20 from '../../assets/ac/normal/20.mp3';
import normal21 from '../../assets/ac/normal/21.mp3';
import normal22 from '../../assets/ac/normal/22.mp3';
import normal23 from '../../assets/ac/normal/23.mp3';

import rain0 from '../../assets/ac/rain/0.mp3';
import rain1 from '../../assets/ac/rain/1.mp3';
import rain2 from '../../assets/ac/rain/2.mp3';
import rain3 from '../../assets/ac/rain/3.mp3';
import rain4 from '../../assets/ac/rain/4.mp3';
import rain5 from '../../assets/ac/rain/5.mp3';
import rain6 from '../../assets/ac/rain/6.mp3';
import rain7 from '../../assets/ac/rain/7.mp3';
import rain8 from '../../assets/ac/rain/8.mp3';
import rain9 from '../../assets/ac/rain/9.mp3';
import rain10 from '../../assets/ac/rain/10.mp3';
import rain11 from '../../assets/ac/rain/11.mp3';
import rain12 from '../../assets/ac/rain/12.mp3';
import rain13 from '../../assets/ac/rain/13.mp3';
import rain14 from '../../assets/ac/rain/14.mp3';
import rain15 from '../../assets/ac/rain/15.mp3';
import rain16 from '../../assets/ac/rain/16.mp3';
import rain17 from '../../assets/ac/rain/17.mp3';
import rain18 from '../../assets/ac/rain/18.mp3';
import rain19 from '../../assets/ac/rain/19.mp3';
import rain20 from '../../assets/ac/rain/20.mp3';
import rain21 from '../../assets/ac/rain/21.mp3';
import rain22 from '../../assets/ac/rain/22.mp3';
import rain23 from '../../assets/ac/rain/23.mp3';


export const AUDIO_MAP: Record<WeatherMode, Record<number, string>> = {
    normal: {
        0: normal0, 1: normal1, 2: normal2, 3: normal3, 4: normal4, 5: normal5,
        6: normal6, 7: normal7, 8: normal8, 9: normal9, 10: normal10, 11: normal11,
        12: normal12, 13: normal13, 14: normal14, 15: normal15, 16: normal16, 17: normal17,
        18: normal18, 19: normal19, 20: normal20, 21: normal21, 22: normal22, 23: normal23,
    },
    rain: {
        0: rain0, 1: rain1, 2: rain2, 3: rain3, 4: rain4, 5: rain5,
        6: rain6, 7: rain7, 8: rain8, 9: rain9, 10: rain10, 11: rain11,
        12: rain12, 13: rain13, 14: rain14, 15: rain15, 16: rain16, 17: rain17,
        18: rain18, 19: rain19, 20: rain20, 21: rain21, 22: rain22, 23: rain23,
    },
};

export function getAudioSrc(weather: WeatherMode, hour: number): string {
    return AUDIO_MAP[weather][hour];
}

export function formatHourDisplay(hour: number): string {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
}
