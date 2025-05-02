"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Edit, Trash2 } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const [values, setValues] = useState({ name: "", location: "", age: "" });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const router = useRouter();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      alert("Failed to fetch users.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!values.name || !values.location || !values.age) {
      alert("All fields are required.");
      return;
    }

    const payload = { ...values, age: parseInt(values.age, 10) };

    try {
      const response = await fetch("http://localhost:8000/api/newuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("User added successfully.");
        setValues({ name: "", location: "", age: "" });
        fetchUsers();
      } else {
        alert("Operation failed.");
      }
    } catch (error) {
      alert({
        title: "Error",
        description: "Error submitting form.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editingId) {
      return handleAddUser(e);
    }

    if (!values.name || !values.location || !values.age) {
      alert("All fields are required.");
      return;
    }

    const payload = { ...values, age: parseInt(values.age, 10) };

    try {
      const response = await fetch(
        `http://localhost:8000/api/updateuser/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("User updated successfully.");
        setValues({ name: "", location: "", age: "" });
        setEditingId(null);
        fetchUsers();
      } else {
        alert("Operation failed.");
      }
    } catch (error) {
      alert({
        title: "Error",
        description: "Error submitting form.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/deleteuser/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          fetchUsers();
          alert("User deleted successfully.");
        }
      } catch (error) {
        alert("Failed to delete user.");
      }
    }
  };

  const handleEdit = (user) => {
    setValues({
      name: user.name,
      location: user.location,
      age: user.age.toString(),
    });
    setEditingId(user.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 md:px-5 px-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button variant="secondary" onClick={() => router.push("/")}>
          Logout
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-medium mb-4">
          {editingId ? "Edit User" : "Create New User"}
        </h2>
        <form
          onSubmit={handleUpdateUser}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={values.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Age</Label>
            <Input
              name="age"
              type="number"
              value={values.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              {editingId ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </div>

      <h2 className="text-xl font-medium">All Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <Card
            key={user.id}
            className="flex flex-col justify-between h-full"
          >
            <CardContent
              className="flex justify-between items-start p-4"
            >
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  Location: {user.location}
                </p>
                <p className="text-sm text-gray-500">Age: {user.age}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;

