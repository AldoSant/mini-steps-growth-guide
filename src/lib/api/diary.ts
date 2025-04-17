
import { supabase } from "@/integrations/supabase/client";
import { DiaryEntry } from "@/types";

export async function fetchDiaryEntries(babyId: string) {
  try {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('baby_id', babyId)
      .order('entry_date', { ascending: false });
      
    if (error) throw error;
    
    const formattedEntries: DiaryEntry[] = data.map(entry => ({
      ...entry,
      type: entry.image_url && entry.image_url.length > 0 ? "photo" : 
            entry.video_url && entry.video_url.length > 0 ? "video" : "note"
    }));
    
    return formattedEntries;
  } catch (error) {
    console.error('Erro ao buscar entradas do diário:', error);
    throw error;
  }
}

export async function addDiaryEntry(entry: Partial<DiaryEntry>, imageFile?: File) {
  try {
    const babyId = entry.baby_id;
    let imageUrl: string[] = [];
    
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${babyId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('diary_images')
        .upload(filePath, imageFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('diary_images')
        .getPublicUrl(filePath);
        
      imageUrl = [publicUrl];
    }
    
    const newEntry = {
      baby_id: babyId,
      title: entry.title,
      content: entry.content,
      entry_date: entry.entry_date,
      image_url: entry.type === "photo" ? imageUrl : [],
      video_url: []
    };
    
    const { data, error } = await supabase
      .from('diary_entries')
      .insert(newEntry)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      type: imageUrl.length > 0 ? "photo" : "note",
      milestone: entry.milestone
    } as DiaryEntry;
  } catch (error) {
    console.error('Erro ao adicionar entrada ao diário:', error);
    throw error;
  }
}

export async function deleteDiaryEntry(id: string) {
  try {
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir entrada do diário:', error);
    throw error;
  }
}
