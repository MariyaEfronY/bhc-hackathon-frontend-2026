"use client";

import { useEffect, useState } from "react";

export default function ApiTestPage() {
    const [message, setMessage] = useState("Connecting...");

    useEffect(() => {
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test`)
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message);
            })
            .catch((error) => {
                console.error(error);
                setMessage("Backend connection failed");
            });
    }, []);

    return (
        <main>
            <h1>Backend Test</h1>
            <p>{message}</p>
        </main>
    );
}