import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    "To Read": [
      { id: 0, author: "Homer", title: "Iliad" },
      { id: 1, author: "Homer", title: "Odyssey" },
      { id: 2, author: "Harper Lee", title: "To Kill a Mockingbird" },
    ],
    "Read": [{
      id: 0, title: "Jony Ive: The Genius Behind Apple Greatest Products", author: "Leander Kahney"
    }],
    "Reading": [
      {id: 0, title: "A Flag Worth Dying For", author: "Tim Marshall"}
    ],
  })
}
