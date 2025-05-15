"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/MainLayout/MainLayout";
import BASE_URL from "@/API/config";

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [open, setOpen] = useState(false);

  // Fetch all users and projects
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        const clientsOnly = data.filter((user) => user.role === "client");
        setClients(clientsOnly);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/projects`);
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClients();
    fetchProjects();
  }, []);

  const getUserProjects = (userId) => {
    const userProjects = projects.filter(
      (project) => project.user && project.user._id === userId
    );
    return (
      userProjects.map((project) => project.name).join(", ") || "No projects"
    );
  };

  const addClient = async () => {
    if (
      newClient.name.trim() &&
      newClient.email.trim() &&
      newClient.password.trim()
    ) {
      try {
        const response = await fetch(`${BASE_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClient),
        });

        if (!response.ok) {
          throw new Error("Failed to register client");
        }

        const data = await response.json();
        setClients([...clients, data.user]);

        setNewClient({
          name: "",
          email: "",
          password: "",
          role: "client",
        });
        setOpen(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 text-center">
          Loading clients...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 text-center text-red-500">
          Error: {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center py-4 px-6 bg-gray-100 rounded-t-md">
          <h1 className="text-2xl font-semibold text-gray-700">Clients</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="mr-1 h-4 w-4" /> Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newClient.password}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <Button onClick={addClient}>Add Client</Button>
            </DialogContent>
          </Dialog>
        </div>

        <table className="w-full border-collapse border border-gray-200 mt-6">
          <thead>
            <tr className="bg-gray-100">
              {[
                "Client ID",
                "Name",
                "Email",
                "Projects",
                "Role",
                "Created At",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="border border-gray-200 px-4 py-2 text-left font-medium"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id} className="border border-gray-200">
                <td className="px-4 py-2">{client._id}</td>
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2">{client.email}</td>
                <td className="px-4 py-2">{getUserProjects(client._id)}</td>
                <td className="px-4 py-2">{client.role}</td>
                <td className="px-4 py-2">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
