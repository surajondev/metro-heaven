const { createClient } = require('@supabase/supabase-js');

const keys = require('../config/keys');

exports.s3Upload = async image => {
  let imageUrl = '';
  let imageKey = '';

  if (image) {

    const supabase = createClient(keys.supabase.url, keys.supabase.anonkey)

    console.log(image)
    // throw error

    const timestamp = Date.now();
    const { data, error } = await supabase.storage
    .from("interiordesign")
    .upload(
      `${timestamp}-${image.originalname}`,
      image.buffer,
      {
        cacheControl: "3600",
        upsert: false,
      }
    );


    if(error){
      console.log(error)
    }

    const path = data.path.replace(/ /g, "%20");

    imageUrl = `https://tuzpwwmxeabokvldguol.supabase.co/storage/v1/object/public/interiordesign/${path}`
    imageKey = `https://tuzpwwmxeabokvldguol.supabase.co/storage/v1/object/public/interiordesign/${path}`
  }

  return { imageUrl, imageKey };
};
