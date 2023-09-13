
import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { toast } from "react-hot-toast";

const getSongsByUserId = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data: sesionData,
        error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.log(sessionError.message);
        return [];
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', sesionData.session?.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.log(error.message);
    }

    return (data as any) || [];
}

export default getSongsByUserId;