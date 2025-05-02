"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; 
import { Card, CardContent } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Form } from "@/components/ui/form";

const page = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "✅ register successful!");
        router.push("/curd");
      } else {
        setMessage(data.message || "❌ Invalid credentials.");
      }
    } catch (error) {
      console.error(error);
      setMessage("🚫 Server error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <Card className="max-w-md w-full shadow-lg rounded-xl p-6">
        <Form
         onSubmit={handleSubmit}>
          <CardContent>
            <h2 className="text-2xl text-center font-semibold mb-4">Register</h2>

            <div className="mb-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-2 p-2 w-full border rounded-md"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2 p-2 w-full border rounded-md"
              />
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>

            {message && (
              <p
                className={`mt-2 text-center ${
                  message.includes("success")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-4 text-center">
              <p>
               Already have an account ?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Form>
      </Card>
    </div>
  );
};

export default page;
