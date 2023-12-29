import GalleryImage from "@models/image";
import { connectToDb } from "@utils/database";


export const POST = async (req) => {
    const { imgUrl, description, category } = await req.json();

    try {
        await connectToDb();
        const newImage = new GalleryImage({
            imageURL:imgUrl,
            description: description,
            category: category
        })

        await newImage.save();
        console.log(newImage);
        return new Response(JSON.stringify(newImage), {status: 201})
    } catch (error) {
        console.log(error)
        return new Response("Failed to create a new image..", {status:500})
    }
}