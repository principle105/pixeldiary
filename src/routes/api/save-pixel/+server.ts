import clientPromise from "$lib/mongodb";
import type { RequestHandler } from "@sveltejs/kit";
import type { Cell, Pixel } from "$lib/types";
import { ObjectId } from "mongodb";

interface ReplyParams {
    userId: string;
    cells: Cell[];
    palette: string;
}

export const POST: RequestHandler = async ({ request }) => {
    const { userId, cells, palette }: ReplyParams = await request.json();

    // TODO: do some validation here

    const usersCollection = (await clientPromise).db().collection("users");

    const pixel: Pixel = {
        id: new ObjectId().toHexString(),
        created: new Date(),
        palette,
        cells,
    };

    const today = new Date();

    const user = await usersCollection.updateOne(
        {
            _id: new ObjectId(userId),
            // Check if the user has already drawn today
            lastDrawn: {
                $not: {
                    $gte: new Date(today.setHours(0, 0, 0)),
                    $lt: new Date(today.setHours(23, 59, 59)),
                },
            },
        },
        {
            $push: {
                drawings: pixel,
            },
            $inc: {
                streak: 1,
            },
            $set: {
                lastDrawn: today,
            },
        }
    );

    if (!user) {
        return new Response(
            JSON.stringify({
                status: 404,
                body: "User not ellgible to draw today.",
            })
        );
    }

    return new Response(
        JSON.stringify({
            status: 200,
            body: "Drawing saved!",
        })
    );
};
