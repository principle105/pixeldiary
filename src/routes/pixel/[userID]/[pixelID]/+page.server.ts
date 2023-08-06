import type { PageServerLoad } from "./$types";
import clientPromise from "$lib/mongodb";
import { ObjectId } from "mongodb";
import type { DatabaseUser, User } from "$lib/types";

interface Response {
    error: string;
    pixel: null;
}

export const load: PageServerLoad = async ({ params, locals }) => {
    const { userID, pixelID } = params;
    const user = (await locals.getSession())?.user as User | undefined;

    const usersCollection = (await clientPromise).db().collection("users");

    const pixelOwner = (await usersCollection.findOne({
        _id: new ObjectId(userID),
    })) as DatabaseUser;

    if (pixelOwner === null) {
        return {
            error: "That pixel does not exist",
            pixel: null,
        } satisfies Response;
    }

    const pixel = pixelOwner.drawings.find((pixel) => pixel.id === pixelID);

    if (pixel === undefined) {
        return {
            error: "That pixel does not exist",
            pixel: null,
        } satisfies Response;
    }

    if (!pixel.public) {
        if (user === undefined) {
            return {
                error: "That pixel is private, you need to be logged in to view it",
                pixel: null,
            } satisfies Response;
        }
        if (pixelOwner._id.toString() !== user.id) {
            return {
                error: "That pixel is private, you do not have permission to view it",
                pixel: null,
            } satisfies Response;
        }
    }

    return {
        error: "",
        pixel,
    };
};
