import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongUrl = (song: Song) => {

    if (!song) {
        return '';
    }

    const supabaseClient = useSupabaseClient();

    const { data: songData } = supabaseClient
        .storage
        .from('songs')
        .getPublicUrl(song.song_path);

    return songData.publicUrl;
}

export default useLoadSongUrl;