'use client';
import { useEffect, useState } from "react";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";

import useSound from 'use-sound';

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {


    const player = usePlayer();

    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioDuration, setAudioDuration] = useState('0:00');
    const [elapsedTime, setElapsedTime] = useState(0);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumenIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);

        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    }

    const onPlayPrevious = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);

        const previouSong = player.ids[currentIndex - 1];

        if (!previouSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previouSong);
    }

    const [play, { pause, sound }] = useSound(
        songUrl, {
        volume: volume,
        onplay: () => setIsPlaying(true),
        onend: () => { setIsPlaying(false); onPlayNext(); },
        onpause: () => setIsPlaying(false),
        format: ['mp3']
    }
    );

    // Hook to Load and play a song
    useEffect(() => {
        sound?.play();

        // END Time of a Song.
        const audio = new Audio(songUrl);

        audio.addEventListener('loadedmetadata', () => {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            setAudioDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        });

        return () => {
            sound?.unload();
            audio.removeEventListener('loadedmetadata', () => { });
        }
    }, [sound]);

    //Hook to keep track of elapsed time in a song.
    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined;

        if (isPlaying) {
            intervalId = setInterval(() => {
                setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isPlaying, elapsedTime]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    function timeStringToSeconds(timeString: string): number {
        const [minutesStr, secondsStr] = timeString.split(':');
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);

        if (!isNaN(minutes) && !isNaN(seconds)) {
            return minutes * 60 + seconds;
        }

        return 0; // Default to 0 if the input is not a valid time format.
    }

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        }
        else {
            pause();
        }
    }

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-1 md:gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            {/* Mobile View / Pause or Play Button */}
            <div className="flex md:hidden col-auto w-full justify-end items-center">
                <div onClick={handlePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
                    <Icon size={30} className='text-black' />
                </div>
            </div>

            {/*Desktop View / Pause or Play Button */}
            <div className="hidden h-full md:flex flex-col justify-center items-center w-full max-w-[722px] gap-x-6">
                <div className="flex items-center justify-center gap-x-6">
                    <AiFillStepBackward onClick={onPlayPrevious} size={30} className='text-neutral-400 cursor-pointer hover:text-white transition' />

                    <div onClick={handlePlay} className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
                        <Icon size={30} className='text-black' />
                    </div>

                    <AiFillStepForward onClick={onPlayNext} size={30} className='text-neutral-400 cursor-pointer hover:text-white transition' />
                </div>

                {/** Music Slider**/}
                <div className="flex items-center gap-x-4 w-[550px]">
                    <div >
                        <h2 className="text-gray-500 text-sm font-semibold py-1" >{formatTime(elapsedTime)}</h2>
                    </div>
                    <Slider value={elapsedTime} possibleMax={timeStringToSeconds(audioDuration)} />
                    <div>
                        <h2 className="text-gray-500 text-sm font-semibold py-1">{audioDuration}</h2>
                    </div>
                </div>
            </div>

            {/**Volume Button**/}
            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumenIcon onClick={toggleMute} size={32} className='cursor-pointer' />
                    <Slider value={volume} possibleMax={1} onChange={(value) => setVolume(value)} />
                </div>
            </div>

        </div>
    );
}

export default PlayerContent;