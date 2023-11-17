
// validation for files
export const checkImage = (file) => {
    let err = ""
    if(!file) return err = "File does not exist."

    // checking size
    if(file.size > 1024 * 1024 ) // 1mb
    err = "The largest image size is 1mb."

    if(file.type !== 'image/jpeg' && file.type !== 'image/png' )
    err = "Image format is incorrect."
    
    return err;
}


export const imageUpload = async (images) => {
    let imgArr = [];
    for(const item of images){
        const formData = new FormData()


        // checking for file form camera

        if(item.camera){
            formData.append("file", item.camera)
        }else{
            formData.append("file", item)
        }
        
        // cloudinary preset !
        formData.append("upload_preset", "connectify")
        formData.append("cloud_name", "connectify4us")  

        const res = await fetch("https://api.cloudinary.com/v1_1/connectify4us/upload", {
            method: "POST",
            body: formData
        })
    
        const data = await res.json();

        // console.log(data);
        
        // here pushing secure_url due to security reason !

        // push public id and url for fetching data form clodinary at showing time.
        imgArr.push({public_id: data.public_id, url: data.secure_url})
    }
    return imgArr;
}