import clientPromise from "$lib/mongodb";
import type { RequestHandler } from "@sveltejs/kit";
import type { DatabaseUser, Pixel, User } from "$lib/types";
import { ObjectId } from "mongodb";

interface ReplyParams {
    pixelId: string;
    pixel: Pixel;
}

export const POST: RequestHandler = async ({ request, locals }) => {
    const { pixelId, pixel }: ReplyParams = await request.json();

    const user = (await locals.getSession())?.user as User | undefined;

    if (user === undefined) {
        return new Response(
            JSON.stringify({
                status: 401,
                body: "You must be logged in to save a pixel.",
            })
        );
    }

    const userId = user.id;

    const usersCollection = (await clientPromise).db().collection("users");

    const newUser = (await usersCollection.findOne({
        _id: new ObjectId(userId),
    })) as DatabaseUser;

    if (!newUser) {
        return new Response(
            JSON.stringify({
                status: 404,
                body: "User not found.",
            })
        );
    }

    const pixelIndex = newUser.drawings.findIndex(
        (pixel) => pixel.id === pixelId
    );

    if (pixelIndex === -1) {
        return new Response(
            JSON.stringify({
                status: 404,
                body: "Pixel not found.",
            })
        );
    }

    await usersCollection.updateOne(
        {
            _id: new ObjectId(userId),
        },
        {
            $set: {
                [`drawings.${pixelIndex}`]: pixel,
            },
        }
    );

    return new Response(
        JSON.stringify({
            status: 200,
            body: "Updated pixel.",
        })
    );
};
